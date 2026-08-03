import { tokenize, parse, evaluate } from "./eclipse.js";

let windowCounter = 0;
const activeWindows = {};

function spawnNewWindow() {
  windowCounter++;
  const windowId = `window_${windowCounter}`;
  const win = createMacWindow(`Eclipse Output #${windowCounter}`, windowId);

  activeWindows[windowId] = win;

  win.querySelector(".close-btn").addEventListener("click", () => {
    delete activeWindows[windowId];
    console.log(`Cleaned up ${windowId} from activeWindows memory.`);
  });

  return win;
}

const runBtn = document.getElementById("runner");

runBtn.addEventListener("click", () => {
  try {
    const code = document.getElementById("editor").innerText;

    const newWin = spawnNewWindow();
    const windowBody = newWin.querySelector(".window-body");

    const printToThisWindow = (text) => {
      const outputLine = document.createElement("p");
      outputLine.innerText = text;
      outputLine.style.margin = "4px 0";
      windowBody.appendChild(outputLine);
    };

    const errorToThisWindow = (text) => {
      const outputLine = document.createElement("p");
      outputLine.innerText = text;
      outputLine.style.margin = "4px 0";
      outputLine.classList.add("log-err")
      windowBody.appendChild(outputLine);
    };

    const askInThisWindow = (promptText) => {
      return new Promise((resolve) => {
        const inputContainer = document.createElement("div");
        inputContainer.classList.add("terminal-input-row");

        const label = document.createElement("span");
        label.classList.add("terminal-input-label");
        label.innerText = promptText;

        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.classList.add("terminal-input-field");

        inputContainer.appendChild(label);
        inputContainer.appendChild(inputField);
        windowBody.appendChild(inputContainer);

        inputField.focus();

        inputField.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            const val = inputField.value;
            inputContainer.innerHTML = `<span class="terminal-input-label">${promptText}</span> <span class="terminal-input-submitted">${val}</span>`;
            resolve(val);
          }
        });
      });
    };

    const tokens = tokenize(code, errorToThisWindow);
    const ast = parse(tokens, errorToThisWindow);
    evaluate(ast, printToThisWindow, errorToThisWindow, askInThisWindow);

  } catch (error) {
    console.error(error);
  }
});
