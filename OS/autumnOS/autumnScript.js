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
}, 1000)

// PROFILE FUNCTIONS
function renderProfile() {
  document.getElementById("nameDisplay").innerText = autumnUser.name;
  if(autumnUser.pfp) {
    let pfpSrc = pfpLinkMaker();
    document.getElementById("pfpDisplay").src = pfpSrc
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
  if(imgFile) {
    autumnUser.pfp = imgFile;
    saveUser();
    renderProfile();
  }
}

function pfpLinkMaker() {
  if(autumnUser.pfp) {
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
  `
  if(autumnUser.pfp) {
    let pfpSrc = pfpLinkMaker();
    document.getElementById("menuProfilePicture").src = pfpSrc
  }
}
async function loadProfile() {
  await loadBackUser();
  renderProfile();
}

loadProfile();