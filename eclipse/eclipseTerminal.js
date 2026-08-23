let terminal = document.getElementById("terminal");
let control = document.getElementById("terminalInput");

let line = 1;

function toggleTerminal() {
  if (terminal.style.display === "none") {
    terminal.style.display = "block";
    control.addEventListener("keydown", handleEvents);
  } else {
    terminal.style.display = "none";
    control.removeEventListener("keydown", handleEvents);
  }
}

async function handleEvents(event) {
  if (event.key === "Backspace") {
    let content = control.value;
    const lines = content.split("\n");
    let curLine = lines[lines.length - 1];
    let curChars = curLine.slice(-2);
    if (curChars === "$ ") {
      event.preventDefault();
    }
  } else if (event.key === "Enter") {
    const content = control.value;
    const lines = content.split("\n");
    const curLine = lines[lines.length - 1];
    const curLineWords = curLine.split(" ");
    const command = curLineWords.slice(3).join(" ");
    event?.preventDefault();
    Logs("");
    await runProgram(command);
    control.value += `\n@stellarOS/root: ${currentPath} $ `;
    line += 1;
  }
}

function Logs(added) {
  control.value += added + "\n";
  line += 1;
}

function newLine() {
  line += 1;
  control.value += `\n@stellarOS/root: ${currentPath} $ `;
}

async function runProgram(command) {
  if (
    command.startsWith("mkdir") ||
    command.startsWith("ls") ||
    command.startsWith("cd") ||
    command.startsWith("rm") ||
    command.startsWith("touch")
  ) {
    await files(command);
  } else if (command.startsWith("save") || command.startsWith("load")) {
    await coded(command);
  } else {
    Logs("command not found");
  }
}

async function coded(command) {
  let parts = command.split(" ");
  if(parts[0] === "save") {
    let fileName = parts[1];
    let file = currentDirectory.files.find(f => f.name === fileName);
    if(file) {
      file.content = document.getElementById("editor").innerText;
      saveRoot();
      Logs("file saved: " + fileName);
    } else {
      Logs("file not found, creating it first...");
      if(!fileName) {
        fileName = "newFile.ecl";
      } else if(!fileName.includes(".") && !fileName.endsWith("ecl")) {
        fileName += ".ecl";
      }
      setTimeout(async () => {
      control.value += `\n@stellarOS/root: ${currentPath} $ touch ${fileName}`;
      await handleEvents({ key: "Enter", preventDefault: () => {} });
      setTimeout(async () => {
      control.value += `save ${fileName}`;
      await handleEvents({ key: "Enter", preventDefault: () => {} });
      }, 500);
      }, 1000);
    }
  } else if(parts[0] === "load") {
    let fileName = parts[1];
    let file = currentDirectory.files.find(f => f.name === fileName);
    if(file) {
      document.getElementById("editor").innerText = file.content;
      Logs("file loaded: " + fileName);
    } else {
      Logs("file not found");
    }
  }
}
 
async function files(command) {
  let parts = command.split(" ");
  if (parts[0] === "mkdir") {
    let dirName = parts[1];
    let newDir = {
      type: "directory",
      name: dirName,
      directory: currentPath + dirName + "/",
      files: [],
    };
    currentDirectory.files.push(newDir);
    saveRoot();
    Logs("created directory " + dirName);
  } else if (parts[0] === "ls") {
    let files = currentDirectory.files;
    if (files.length === 0) {
      Logs("no files found");
    } else {
      let fileNames = files.map((f) => f.name);
      Logs("files in current directory:");
      fileNames.forEach((name) => {
        if (!name.startsWith(".")) {
          Logs("- " + name);
        } else if (name.startsWith(".") && parts.includes("-all")) {
          Logs("- " + name);
        }
      });
    }
  } else if (parts[0] === "cd") {
    let dirName = parts[1];
    if (dirName === "..") {
      if (currentDirectory.name !== "root") {
        let parentDirPath =
          currentDirectory.directory.split("/").slice(0, -2).join("/") + "/";
        let parentDir = root;
        if (parentDirPath !== "/") {
          let pathParts = parentDirPath.split("/").filter((p) => p !== "");
          for (let part of pathParts) {
            parentDir = parentDir.files.find(
              (f) => f.type === "directory" && f.name === part,
            );
          }
        }
        currentDirectory = parentDir;
        currentPath = currentDirectory.directory;
        Logs("changed directory to " + currentPath);
      } else {
        Logs("directory not found");
      }
    } else {
      let newDir = currentDirectory.files.find(
        (f) => f.type === "directory" && f.name === dirName,
      );
      if (newDir) {
        currentDirectory = newDir;
        currentPath = currentDirectory.directory;
        Logs("changed directory to " + currentPath);
      } else {
        Logs("directory not found");
      }
    }
  } else if (parts[0] === "touch") {
    let fileName = parts[1];
    let fileParts = fileName.split(".");
    let newFile = {
      type: "file",
      name: fileName,
      directory: currentPath + fileName,
      content: "",
      typeFile: fileParts[fileParts.length - 1],
    };
    currentDirectory.files.push(newFile);
    saveRoot();
    Logs("file created: " + fileName);
  } else if (parts[0] === "rm") {
    let fileName = parts[1];
    let fileIndex = currentDirectory.files.findIndex(
      (f) => f.name === fileName,
    );
    if (fileIndex !== -1) {
      currentDirectory.files.splice(fileIndex, 1);
      saveRoot();
      Logs("file removed: " + fileName);
    } else {
      Logs("file not found");
    }
  }
}

function progressBar(time, name) {
  Logs("installing " + name + "...");
  let bar = "";
  let num = 0;
  let partTime = time / 100;
  const looper = setInterval(() => {
    bar += "|";
    num += 1;
    let total = control.value;
    let lines = total.split("\n");
    lines.splice(-1, 1);
    lines.push(bar + " " + num + "%");
    let newText = lines.join("\n");
    control.value = newText;
    if (num === 100) {
      clearInterval(looper);
      Logs("");
      Logs("successfully installed " + name);
      newLine();
    }
  }, partTime);
}
