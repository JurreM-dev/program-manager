function addWindow(windowName) {
  let windowBody = document.createElement("div");
  windowBody.classList.add("window");
  document.body.appendChild(windowBody);

  // making top bar
  let titleBar = document.createElement("div");
  titleBar.classList.add("windowTitle");
  windowBody.appendChild(titleBar);

  makeDraggable(windowBody, titleBar);

  let closeBtn = document.createElement("button");
  closeBtn.innerText = "x"
  closeBtn.classList.add("windowBtn")
  closeBtn.addEventListener("pointerdown", (event) => {
  event.stopPropagation();
  });
  closeBtn.onclick = () => windowBody.remove();
  titleBar.appendChild(closeBtn)

  title = document.createElement("p");
  title.innerText = windowName;
  titleBar.appendChild(title);

  let innerWindow = document.createElement("div");
  windowBody.appendChild(innerWindow);
  return innerWindow;
}