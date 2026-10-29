let typingIndicator = "@bronzeOS:user :~ $ "

// preventing backspaces and process enters
document.getElementById("terminal").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const input = document.getElementById("terminal").value;
        const line = input.split("\n").pop().replace(typingIndicator, "");
        
        processCommand(line);
        document.getElementById("terminal").value += `\n${typingIndicator}`;
    } else if (event.key === "Backspace") {
        const currentValue = document.getElementById("terminal").value;
        if (currentValue.endsWith(typingIndicator)) {
            event.preventDefault();
        };
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
    }
});

// making sure you can't just place your cursor back
document.getElementById("terminal").addEventListener("pointerdown", function(event) {
    event.preventDefault();
    document.getElementById("terminal").focus();
});

// putting typing indicator in the terminal on load
window.addEventListener("load", function() {
    document.getElementById("terminal").value = typingIndicator;
    document.getElementById("terminal").focus();
});

// ================================================
// actual terminal logic
// ================================================

function processCommand(line) {
    console.log(line);
}