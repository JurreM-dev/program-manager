// defining the kernel

// CLI commands
const terminalCommands = {
  println,
  newLine,
  clear: clearTerminal,
  refreshTypingIndicator,
  changeColor,
  changeBackColor,
};

// GUI commands
const GUICommands = {
  showWindow,
  closeWindow,
  changeWindow,
  setWindowSettings,
};

const kernel = new BronzeKernel(terminalCommands, GUICommands);

let typingIndicator = `@bronzeOS:${kernel.userName} :~ $ `;

const terminal = document.getElementById("terminal");

// preventing backspaces and process enters
terminal.addEventListener("keydown", function (event) {
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
    }
  } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
  }
});

// making sure you can't just place your cursor back
terminal.addEventListener("pointerdown", function (event) {
  event.preventDefault();
  terminal.focus();
});

// putting typing indicator in the terminal on load
window.addEventListener("load", function () {
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
  terminal.value += `\n${content}`;
}

function clearTerminal() {
  terminal.value = "";
}

function refreshTypingIndicator() {
  typingIndicator = `@bronzeOS:${kernel.userName} :~ $ `;
}

function changeColor(color) {
  terminal.style.color = color;
}
function changeBackColor(color) {
  terminal.style.backgroundColor = color;
}

// GUI functions
let windowHtml = `
<iframe class="standardFrame" src="%LINK%"></iframe>
`;

let windowStyle = "";

let draggableWindows = false;
let multipleWindows = false;
let resizeWindows = false;

let handleId = null;

function changeWindow(html, selfStyles = "") {
  console.log("changing window html to: " + html);
  windowHtml = html;
  windowStyle = selfStyles;
}

function showWindow(link, { handle = null } = {}) {
  if (!multipleWindows) {
    const existingWindows = document.querySelectorAll(".window");
    existingWindows.forEach((window) => {
      window.remove();
    });
  }
  const windowBody = document.createElement("div");
  windowBody.classList.add("window");
  if (windowStyle) {
    windowBody.setAttribute("style", windowStyle);
  }
  windowBody.innerHTML = windowHtml.replace("%LINK%", link);
  const selector = handle || handleId;
  const dragHandle = selector
    ? windowBody.querySelector(`.${selector}`)
    : windowBody;
  if (draggableWindows) {
    makeDraggable(windowBody, dragHandle);
  }
  if (resizeWindows) {
    windowBody.style.resize = "both";
  }
  windowBody.style.display = "flex";
  document.body.appendChild(windowBody);
}

function closeWindow() {
  const windows = document.querySelectorAll(".window");
  windows.forEach((window) => {
    window.remove();
  });
}

function setWindowSettings({
  draggable = false,
  multiple = false,
  resizable = false,
  handle = null,
} = {}) {
  handleId = handle;
  draggableWindows = draggable;
  multipleWindows = multiple;
  resizeWindows = resizable;
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
