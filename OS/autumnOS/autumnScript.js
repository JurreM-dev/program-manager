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