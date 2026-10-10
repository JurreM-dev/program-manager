function openCalc() {
  openApp("calculator", "apps/calculator.html");
}

function openSkyDocs() {
  openApp("skyDocs", "apps/skyDocs.html");
}

function openApp(appName, appPath) {
  const windowBody = addWindow(appName);
  let frame = document.createElement("iframe");
  frame.src = `./../../${appPath}`;
  windowBody.appendChild(frame);
}

function updateTime() {
  const now = new Date();
  const time = now.toLocaleTimeString();

  document.getElementById("currentTime").innerText = time;
}

setInterval(() => {
  updateTime();
}, 1000);

// PROFILE FUNCTIONS
function renderProfile() {
  document.getElementById("nameDisplay").innerText = autumnUser.name;
  if (autumnUser.pfp) {
    let pfpSrc = pfpLinkMaker();
    document.getElementById("pfpDisplay").src = pfpSrc;
  }
}

function updateProfile(nameIn) {
  let newName = document.getElementById(nameIn).value;
  autumnUser.name = newName ?? "guest user";
  uploadImage();
  saveUser();
  renderProfile();
}

function uploadImage() {
  const imageInput = document.getElementById("pfpInput");
  const imgFile = imageInput?.files[0];
  if (imgFile) {
    autumnUser.pfp = imgFile;
    saveUser();
    renderProfile();
  }
}

function pfpLinkMaker() {
  if (autumnUser.pfp) {
    const pfpURL = URL.createObjectURL(autumnUser.pfp);
    return pfpURL;
  }
  return null;
}

function openProfileChanger() {
  const windowBody = addWindow("profile manager");
  windowBody.innerHTML = `
  <div id="profileChangerMenu">
    <img id="menuProfilePicture">
    <p>image:</p>
    <input type="file" id="pfpInput" accept="image/*">
    <input id="nameInput" placeholder="your name?" value="${autumnUser.name}">
    <button onclick="updateProfile('nameInput')">confirm</button>
  </div>
  `;
  if (autumnUser.pfp) {
    let pfpSrc = pfpLinkMaker();
    document.getElementById("menuProfilePicture").src = pfpSrc;
  }
}

function openAppStore() {
  const windowBody = addWindow("app store");
  console.log(appList);
  Object.keys(appList).forEach((appKey) => {
    let app = appList[appKey];
    console.log(app);
    if (!app.version.startsWith("x") && app.version !== "v0.0.0") {
      let downloadBtn = document.createElement("button");
      downloadBtn.innerText = app.name;
      downloadBtn.onclick = () => {
        if (apps[app.name] && apps[app.name].version === app.version) {
          alert("you already have this app and version installed!");
        } else if (apps[app.name]) {
          alert(
            "you already have this app, but new version available, updating...",
          );
          apps[app.name] = app;
          renderApps();
        } else {
          alert("installing app...");
          installApp(app.name);
        }
      };
      windowBody.appendChild(downloadBtn);
    }
  });
}

async function loadProfile() {
  await loadBackUser();
  renderProfile();
}

loadProfile();
