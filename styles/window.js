function makeDraggable(windowEl, handleEl) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  handleEl.addEventListener("mousedown", (e) => {
    isDragging = true;
    
    // Calculate initial click offset relative to the window frame
    offsetX = e.clientX - windowEl.offsetLeft;
    offsetY = e.clientY - windowEl.offsetTop;

    // Bring clicked window to the front
    windowEl.style.zIndex = 1000;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    // Move window based on cursor coordinates minus offset
    windowEl.style.left = `${e.clientX - offsetX}px`;
    windowEl.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
}

// Add 'id' parameter with a fallback default
function createMacWindow(title = "Output Window", id = null) {
  const win = document.createElement("div");
  win.className = "mac-window";
  
  // If an ID was passed in, set it on the DOM element!
  if (id) {
    win.id = id;
  }

  win.style.position = "absolute";
  win.style.left = "100px";
  win.style.top = "100px";

  win.innerHTML = `
    <div class="window-bar">
      <div class="dots">
        <span class="dot red close-btn"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      <span class="title">${title}</span>
    </div>
    <div class="window-body"></div>
  `;

win.querySelector(".close-btn").addEventListener("click", () => {
  win.remove();
});

  makeDraggable(win, win.querySelector(".window-bar"));
  document.body.appendChild(win);

  return win;
}

