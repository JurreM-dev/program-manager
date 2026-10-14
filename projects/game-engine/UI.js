function toggleToolsBar(type) {
    const toolsBar = document.getElementById("toolsBar");

    if(type === "close") {
        toolsBar.style.display = "none";
    } else if(type === "open") {
        toolsBar.style.display = "flex";
    }
}

function openEditorPage(pageId) {
    let pages = document.querySelectorAll(".editorPage");
    pages.forEach((page) => {
        page.style.display = "none";
    });
    document.getElementById(pageId).style.display = "flex";
}