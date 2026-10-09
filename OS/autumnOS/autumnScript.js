function openCalc() {
  const windowBody = addWindow("calculator");
  let frame = document.createElement("iframe");
  frame.src = "../../apps/calculator.html"
  windowBody.appendChild(frame);
}

function openSkyDocs() {
  const windowBody = addWindow("sky docs");
  let frame = document.createElement("iframe");
  frame.src = "../../apps/skyDocs.html"
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
}

function updateProfile(nameIn) {
  let newName = document.getElementById(nameIn).value;
  autumnUser.name = newName ?? "guest user";
  saveUser();
  renderProfile();
}

function openProfileChanger() {
  const windowBody = addWindow("profile manager");
  windowBody.innerHTML = `
  <div id="profileChangerMenu">
    <input id="nameInput" placeholder="your name?" value="${autumnUser.name}">
    <button onclick="updateProfile('nameInput')">confirm</button>
  </div>
  `
}

async function loadProfile() {
  await loadBackUser();
  renderProfile();
}

loadProfile();