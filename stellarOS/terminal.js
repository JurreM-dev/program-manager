let line = 1;
let data = {};
let osData = {};

// KEYDOWN EVENT
document.addEventListener("keydown", async (e) => {
  if (e.key === "Backspace") {
    let content = document.getElementById("terminal").value;
    const lines = content.split("\n");
    let curLine = lines[lines.length - 1];
    let curChars = curLine.slice(-2);
    if (curChars === "$ ") {
      e.preventDefault();
    }
  } else if (e.key === "Enter") {
    let content = document.getElementById("terminal").value;
    const lines = content.split("\n");
    let curLine = lines[lines.length - 1];
    curLineWords = curLine.split(" ");
    const command = curLineWords.slice(3).join(" ");
    Logs("");
    await runProgram(command);
    e.preventDefault();
    document.getElementById("terminal").value +=
      `\n@stellarOS/root: ${currentPath} $ `;
    line += 1;
  }
});

// HELPER FUNCTIONS
function Logs(added) {
  document.getElementById("terminal").value += added + "\n";
  line += 1;
}

function newLine() {
  line += 1;
  document.getElementById("terminal").value +=
    `\n@stellarOS/root: ${currentPath} $ `;
}

function progressBar(time, name) {
  Logs("installing " + name + "...");
  let bar = "";
  let num = 0;
  let partTime = time / 100;
  const looper = setInterval(() => {
    bar += "|";
    num += 1;
    let total = document.getElementById("terminal").value;
    let lines = total.split("\n");
    lines.splice(-1, 1);
    lines.push(bar + " " + num + "%");
    let newText = lines.join("\n");
    document.getElementById("terminal").value = newText;
    if (num === 100) {
      clearInterval(looper);
      Logs("");
      Logs("successfully installed " + name);
      newLine();
    }
  }, partTime);
}

// FETCHING JSON FILES
async function getPrograms() {
  data = await (await fetch("./programs.json")).json();
}

async function getOS() {
  osData = await (await fetch("./os.json")).json();
}

// RUNNING COMMANDS
async function runProgram(command) {
  if (command.startsWith("program")) {
    await Programs(command);
  } else if (command.startsWith("os")) {
    await Os(command);
  } else if (
    command.startsWith("mkdir") ||
    command.startsWith("ls") ||
    command.startsWith("cd") ||
    command.startsWith("rm") ||
    command.startsWith("touch")
  ) {
    await files(command);
  } else if(command.startsWith("help")) {
    terminalHelp();
  } else {
    Logs("command not found");
  }
}

// ==============================================================
// SMALLER COMMANDS
// ==============================================================

function terminalHelp() {
    Logs("Welcome to stellarOS!");
    Logs(" ");
    Logs("available commands are:");
    Logs(" ")
    Logs("program install <name>");
    Logs("program open <name>");
    Logs("program list")
    Logs("os download <name>");
    Logs("os boot <name>");
    Logs("os standardize <name>");
    Logs("mkdir <directory_name>");
    Logs("ls [--all]");
    Logs("cd <directory_name>");
    Logs("cd ..");
    Logs("touch <file_name>");
    Logs("rm <file_name>");
}


// ==============================================================
// MAJOR COMMANDS
// ==============================================================

// FILE COMMANDS
async function files(command) {
  let parts = command.split(" ");
  if (parts[0] === "mkdir") {
    let dirName = parts[1];
    mkdir(dirName);
    Logs("created directory " + dirName);
  } else if (parts[0] === "ls") {
    let files = currentDirectory.files;
    if (files.length === 0) {
      Logs("no files found");
    } else {
      let fileNames = files.map((f) => f.name);
      Logs("files in current directory:");
      fileNames.forEach((name) => {
        if (!name.startsWith(".") && parts.includes("--all")) {
          Logs("- " + name);
        } else if (name.startsWith(".")) {
        } else {
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

// PROGRAM COMMANDS
async function Programs(command) {
  let parts = command.split(" ");

  // INSTALLING PROGRAMS
  if (parts[1] === "install") {
    let programName = parts[2];
    await getPrograms();
    if (data.programs[programName]) {
      let cur = data.programs[programName];
      if (cur.version !== "v0.0.0" || cur.version.startsWith("x")) {
        const downloadTime = cur.installTime ?? 3000;
        progressBar(downloadTime, cur.name);
        root.programs.push(cur);
        saveRoot();
      } else {
        Logs(cur.message);
      }
    } else {
      Logs("program " + programName + " does not exist sorry");
    }

  // OPENING PROGRAMS
  } else if (parts[1] === "open") {
    let programName = parts[2];
    if (root.programs.some((p) => p.name === programName)) {
      let cur = root.programs.find((p) => p.name === programName);
      if (cur.path) {
        window.location.href = cur.path;
      } else {
        Logs("program is broken, cannot open");
      }
    } else {
        Logs("cannot find program");
    }
  } else if(parts[1] === "list") {
    await getPrograms();
    console.log(data);
    Object.keys(data.programs).forEach((key) => {
      let program = data.programs[key];
      if(program.version !== "v0.0.0" && !program.version.startsWith("x")) {
        Logs(data.programs[key].name);
      }
    })
  }
}

// OS COMMANDS
async function Os(command) {
  let parts = command.split(" ");
  let osName = parts[2];
  if (parts[1] === "download") {
    await getOS();
    if (!osData) {
      Logs("error in fetching OS files");
      return;
    }
    if (!osData.os) {
      Logs("error in fetching OS files");
      return;
    }
    if (!osData.os[osName]) {
      Logs("OS you are trying to find doesn't exist");
      return;
    }
    let cur = osData.os[osName];
    if (cur.version !== "v0.0.0" || cur.version.startsWith("x")) {
      const downloadTime = cur.downloadTime ?? 3000;
      progressBar(downloadTime, cur.name);
      installOs(cur);
    } else {
      Logs(cur.message);
    }
  } else if (parts[1] === "boot") {
    let attempt = bootOs(osName);
    if (!attempt) {
      Logs("failed to boot OS");
    }
  } else if ("standardize" === parts[1]) {
    standardizeOs(osName);
  } else {
    Logs(parts[1]);
    Logs("invalid command");
  }
}
