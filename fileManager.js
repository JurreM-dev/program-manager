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

function saveRoot() {
  localforage.setItem("rootSave", root);
}

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

function cd(dirName) {
  if (dirName === "..") {
    if (currentPath !== "/") {
      let pathParts = currentPath.split("/").filter((part) => part !== "");
      pathParts.pop();
      currentPath = "/" + pathParts.join("/") + (pathParts.length > 0 ? "/" : "");
      currentDirectory = getDirectoryByPath(currentPath);
    }
  } else {
    let dir = currentDirectory.files.find(
      (f) => f.name === dirName && f.type === "directory"
    );
    if (dir) {
      currentDirectory = dir;
      currentPath += dirName + "/";
    } else {
      throw new Error("Directory not found");
    }
  }
}

function getDirectoryByPath(path) {
  if (path === "/") {
    return root;
  }

  let directory = root;
  const pathParts = path.split("/").filter((part) => part !== "");
  for (const part of pathParts) {
    directory = directory.files.find(
      (file) => file.name === part && file.type === "directory"
    );
    if (!directory) {
      throw new Error("Directory not found");
    }
  }
  return directory;
}

function writeFile(fileName, content) {
  const file = currentDirectory.files.find(
    (entry) => entry.name === fileName && entry.type === "file"
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
    (f) => f.name === fileName && f.type === "file"
  );
  if (file) {
    return file.content;
  } else {
    throw new Error("File not found");
  }
}