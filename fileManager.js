let root = {
  files: [],
  programs: [],
  name: "root",
  directory: "/",
};

let currentDirectory = root;
let currentPath = "/";

window.fileManagerReady = (async () => {
  const potential = await localforage.getItem("rootSave");
  if (potential) {
    root = potential;
    currentDirectory = root;
    currentPath = "/";
  }
})();

// MAIN SYSTEMS
function saveRoot() {
  localforage.setItem("rootSave", root);
}

function getDirectoryByPath(path) {
  if (path === "/") {
    return root;
  }

  let directory = root;
  const pathParts = path.split("/").filter((part) => part !== "");
  for (const part of pathParts) {
    directory = directory.files.find(
      (file) => file.name === part && file.type === "directory",
    );
    if (!directory) {
      throw new Error("Directory not found");
    }
  }
  return directory;
}

// MAIN FILE MANAGER COMMANDS
function mkdir(dirName) {
  let newDir = {
    type: "directory",
    name: dirName,
    directory: currentPath + dirName + "/",
    files: [],
  };
  currentDirectory.files.push(newDir);
  saveRoot();
}

function touch(fileName) {
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
}

function cd(dirName, Logs = console.log) {
  if (dirName === "..") {
    if (currentPath !== "/") {
      let pathParts = currentPath.split("/").filter((part) => part !== "");
      pathParts.pop();
      currentPath =
        "/" + pathParts.join("/") + (pathParts.length > 0 ? "/" : "");
      currentDirectory = getDirectoryByPath(currentPath);
    }
  } else {
    let dir = currentDirectory.files.find(
      (f) => f.name === dirName && f.type === "directory",
    );
    if (dir) {
      currentDirectory = dir;
      currentPath += dirName + "/";
      Logs("changed directory to " + currentPath);
    } else {
      Logs("error, could not find directory");
      return;
    }
  }
}

function rm(fileName, Logs = console.log) {
  let fileIndex = currentDirectory.files.findIndex((f) => f.name === fileName);
  if (fileIndex !== -1) {
    currentDirectory.files.splice(fileIndex, 1);
    saveRoot();
    Logs("file removed: " + fileName);
  } else {
    Logs("file not found");
  }
}

function ls(parts, Logs = console.log) {
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
}

// READING AND WRITING FILES

function writeFile(fileName, content, log = console.log) {
  const file = currentDirectory.files.find(
    (entry) => entry.name === fileName && entry.type === "file",
  );
  if (file) {
    file.content = content;
  } else {
    currentDirectory.files.push({
      type: "file",
      name: fileName,
      directory: currentPath + fileName,
      content: content,
    });
  }
  saveRoot();
}

function readFile(fileName) {
  let file = currentDirectory.files.find(
    (f) => f.name === fileName && f.type === "file",
  );
  if (file) {
    return file.content;
  } else {
    log("File not found");
  }
}
