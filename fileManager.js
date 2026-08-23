let root = {
    files: [],
    programs: [],
    name: "root",
    directory: "/"
}

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