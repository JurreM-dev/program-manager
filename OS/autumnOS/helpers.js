function makeDraggable(element, handle = element) {
  if (typeof element === "string") element = document.querySelector(element);
  if (!element) throw new Error("Draggable element not found");

  if (typeof handle === "string") handle = element.querySelector(handle);
  if (!handle) throw new Error("Drag handle not found");

  handle.style.cursor = "grab";
  handle.style.touchAction = "none";

  let startX;
  let startY;
  let startLeft;
  let startTop;

  handle.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const rect = element.getBoundingClientRect();
    startX = event.clientX;
    startY = event.clientY;
    startLeft = rect.left;
    startTop = rect.top;

    element.style.position = "fixed";
    element.style.left = `${rect.left}px`;
    element.style.top = `${rect.top}px`;
    element.style.margin = "0";

    handle.style.cursor = "grabbing";
    handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  handle.addEventListener("pointermove", (event) => {
    if (!handle.hasPointerCapture(event.pointerId)) return;

    element.style.left = `${startLeft + event.clientX - startX}px`;
    element.style.top = `${startTop + event.clientY - startY}px`;
  });

  function stopDragging(event) {
    if (handle.hasPointerCapture(event.pointerId)) {
      handle.releasePointerCapture(event.pointerId);
    }
    handle.style.cursor = "grab";
  }

  handle.addEventListener("pointerup", stopDragging);
  handle.addEventListener("pointercancel", stopDragging);
}
