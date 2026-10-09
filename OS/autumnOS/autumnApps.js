let apps = {};

let appList;

async function fetchApps() {
    let raw = await (await fetch("./../../programs.json")).json();
    appList = raw.programs;
}

function renderApps() {
    const appContainer = document.getElementById("appDiv");
    appContainer.replaceChildren();
    Object.keys(apps).forEach((appKey) => {
        let app = apps[appKey];
        let icon = document.createElement("button");
        icon.classList.add("appIcon")
        icon.onclick = () => {
            openApp(app.name, app.path);
        }
        icon.innerText = app.iconEmoji;
        appContainer.appendChild(icon);
    })
}

async function installApp(appName) {
    apps[appName] = appList[appName];
    renderApps();
}

async function startRun() {
    await fetchApps();
    installApp("calculator");
    installApp("skyDocs");
}
startRun();