let root = {
    files: [],
    programs: [],
    name: "root",
    directory: "/"
}

let currentDirectory = root;
let currentPath = "/";

document.addEventListener("DOMContentLoaded", async () => {
    const potential = await localForage.getItem("rootSave");
    if (potential) {
        root = potential;
        currentDirectory = root;
        currentPath = "/";
    }
});

function saveRoot() {
    localForage.setItem("rootSave", root);
}