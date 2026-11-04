// defining the kernel

// CLI commands 
const terminalCommands = {
    println,
    newLine,
    clear: clearTerminal,
    refreshTypingIndicator,
    changeColor,
    changeBackColor
}

// GUI commands
const GUICommands = {
    showWindow,
    closeWindow,
    changeWindow
}

const kernel = new BronzeKernel(terminalCommands, GUICommands);

let typingIndicator = `@bronzeOS:${kernel.userName} :~ $ `

const terminal = document.getElementById("terminal");

// preventing backspaces and process enters
terminal.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const input = terminal.value;
        const line = input.split("\n").pop().replace(typingIndicator, "");
        
        processCommand(line);
        newLine();
    } else if (event.key === "Backspace") {
        const currentValue = terminal.value;
        if (currentValue.endsWith(typingIndicator)) {
            event.preventDefault();
        };
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
    }
});

// making sure you can't just place your cursor back
terminal.addEventListener("pointerdown", function(event) {
    event.preventDefault();
    terminal.focus();
});

// putting typing indicator in the terminal on load
window.addEventListener("load", function() {
    document.getElementById("terminal").value = typingIndicator;
    document.getElementById("terminal").focus();
});

// ================================================
// terminal functions
// ================================================

// CLI functions
function newLine() {
    terminal.value += `\n${typingIndicator}`;
}

function println(content) {
    terminal.value += `\n${content}`
}

function clearTerminal() {
    terminal.value = "";
}

function refreshTypingIndicator() {
    typingIndicator = `@bronzeOS:${kernel.userName} :~ $ `
}

function changeColor(color) {
    terminal.style.color = color;
}
function changeBackColor(color) {
    terminal.style.backgroundColor = color;
}

// GUI functions
let windowHtml = `
<iframe id="windowFrame" class="standardFrame" src="%LINK%"></iframe>
`;

let draggableWindows = false;
let multipleWindows = false;
let resizeWindows = false;

function changeWindow(html) {
    console.log("changing window html to: " + html);
    windowHtml = html;
}

function showWindow(link, { handle = null}) {
    if(!multipleWindows) {
        const existingWindows = document.querySelectorAll(".window");
        existingWindows.forEach((window) => {
            window.remove();
        });
    }
    const windowBody = document.createElement("div");
    if(draggableWindows) {
        if(handle) {
            makeDraggable(windowBody, handle);
        } else {
            makeDraggable(windowBody);
        }
    }
    windowBody.classList.add("window");
    windowBody.innerHTML = windowHtml.replace("%LINK%", link);
    if(resizeWindows) {
        windowBody.style.resize = "both";
    }
    windowBody.style.display = "block";
    document.body.appendChild(windowBody);
}

function closeWindow() {
    const windows = document.querySelectorAll(".window");
    windows.forEach((window) => {
        window.remove();
    });
}

function saveWindowSettings(draggable = false, multiple = false) {
    draggableWindows = draggable;
    multipleWindows = multiple;
}

// ================================================
// actual terminal logic
// ================================================

function processCommand(line) {
    const commandLine = line.trim();

    let parts = commandLine.split(" ");
    let command = parts[0];
    let rest = parts.slice(1).join(" ");
    kernel.exec(command, rest, terminalCommands, GUICommands);
}