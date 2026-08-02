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

    const tokens = tokenize(code, errorToThisWindow);
    const ast = parse(tokens, errorToThisWindow);
    evaluate(ast, printToThisWindow, errorToThisWindow, prompt);

  } catch (error) {
    console.error(error);
  }
});
