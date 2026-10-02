let root = {
  files: [],
  programs: [],
  name: "root",
  directory: "/",
};

let currentDirectory = root;
let currentPath = "/";

document.addEventListener("DOMContentLoaded", async () => {
  const potential = await localforage.getItem("rootSave");
  if (potential) {
    root = potential;
    currentDirectory = root;
    currentPath = "/";
  }
});

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

function writeFile(fileName, content) {
  if (!currentDirectory.files.includes(fileName)) {
  let newFile = {
    type: "file",
    name: fileName,
    directory: currentPath + fileName,
    content: content,
  };
  currentDirectory.files.push(newFile);
  saveRoot();
} else {
  
}
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