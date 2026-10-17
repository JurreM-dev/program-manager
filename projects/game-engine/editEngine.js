function toggleDebug() {
  const option = document.getElementById("physicsDebugOption");
  const enabled = option.checked;

  physicsDebug = enabled;
  applyDebugState();
}

function applyDebugState() {
  if (!activeScene?.physics?.world) {
    return;
  }

  const world = activeScene.physics.world;
  if (physicsDebug && !world.debugGraphic) {
    world.createDebugGraphic();
  }

  world.drawDebug = physicsDebug;
  if (world.debugGraphic) {
    world.debugGraphic.setVisible(physicsDebug);
    if (!physicsDebug) {
      world.debugGraphic.clear();
    }
  }
}

function movementChange(elementId, key) {
  const newValue = Number(document.getElementById(elementId).value);
  movement[key] = Number.isFinite(newValue) ? newValue : 0;
}

function renderEntities(entities) {
  const output = document.getElementById("items");

  output.replaceChildren();

  entities.forEach((entity) => {
    output.innerHTML += `
            <div class="entityBox">
                <h1>${DOMPurify.sanitize(entity.name)}
            </div>
        `;
  });
}

function renderAllEntities() {
  const output = document.getElementById("items");

  output.replaceChildren();

  Object.keys(entities).forEach((typing) => {
    if (entities[typing].length > 0) {
      output.innerHTML += `
                <h1>${DOMPurify.sanitize(typing)}</h1>
                <hr>
            `;
    }
    entities[typing].forEach((entity) => {
      output.innerHTML += `
                <div onclick='openEditingMenu("${typing}", ${JSON.stringify(entity)}, "edit")' class="entityBox">
                    <h2>${DOMPurify.sanitize(entity.name)}</h2>
                </div>
            `;
    });
  });
}

function addEntity(entityType, entitySample) {
  entities[entityType].push(entitySample);

  renderAllEntities();
  restartScene();
}

function addCube() {
  let x = Number(prompt("x")) ?? 120;
  let y = Number(prompt("y")) ?? 70;
  let width = Number(prompt("width")) ?? 40;
  let height = Number(prompt("height")) ?? 40;
  let color = prompt("color in the format 0x...");
  let name = prompt("name");

  let sample = {
    x: x,
    y: y,
    width: width,
    height: height,
    color: color,
    name: name,
  };
  addEntity("cubes", sample);
  renderAllEntities();
}

function addCircle() {
  let x = Number(prompt("x")) ?? 120;
  let y = Number(prompt("y")) ?? 70;
  let radius = Number(prompt("radius")) ?? 30;
  let color = prompt("color in the format 0x...");
  let name = prompt("name");

  addEntity("circles", {
    x: x,
    y: y,
    radius: radius,
    color: color,
    name: name,
  });
  renderAllEntities();
}

function addPlatform() {
  let x = Number(prompt("x")) ?? 120;
  let y = Number(prompt("y")) ?? 70;
  let width = Number(prompt("width")) ?? 40;
  let height = Number(prompt("height")) ?? 40;
  let color = prompt("color in the format 0x...");
  let name = prompt("name");

  let sample = {
    x: x,
    y: y,
    width: width,
    height: height,
    color: color,
    name: name,
  };
  addEntity("platforms", sample);
  renderAllEntities();
}

function addPlayer() {
  let type = prompt("type") ?? "none";
  let name = prompt("name") ?? "none";
  if(type === "none" || type === "platforms") {
    alert("you cannot make a platform a player!")
    return;
  }
  const playerObj = entities[type].find((item) => item.name === name);
  if (playerObj) {
    currentPlayer = playerObj;
    restartScene();
  } else {
    alert("entity not found");
  }
}

// EDITING MENU
function darkenScreen() {
  document.getElementById("darkenScreen").style.display = "flex";
}
function lightenScreen() {
  document.getElementById("darkenScreen").style.display = "none";
}

function openEditingMenu(type, item, mode) {
  if (typeof item === "string") {
    item = JSON.parse(item);
  }

  if (type === "cubes") {
    darkenScreen();
    openEdit(item, mode, "cubes");
  } else if(type === "circles") {
    darkenScreen();
    openEdit(item, mode, "circles");
  } else if(type === "platforms") {
    darkenScreen();
    openEdit(item, mode, "circles");
  }
}

function openEdit(item, mode, type) {
  output = document.getElementById("editEntityBody");

  currentEditing = item.name;

  output.replaceChildren();
  if (mode === "edit") {
    document.getElementById("editEntityMenu").style.display = "flex";
    let parts = {};
    Object.keys(item).forEach((itemName) => {
      UI.create.text(itemName, output);
      let viewedItem = item[itemName];
      if (typeof viewedItem === "number") {
        parts[itemName] = UI.create.numInput(output, viewedItem);
      } else if (typeof viewedItem === "string") {
        parts[itemName] = UI.create.strInput(output, viewedItem);
      }
    });
    let confirmer = UI.create.button("confirm", output);
    confirmer.onclick = () => {
      let found = {};

      Object.keys(parts).forEach((partName) => {
        found[partName] = parts[partName].value;
      });

      const original = entities[type].find(
        (entity) => entity.name === currentEditing,
      );

      if (original) {
  Object.keys(found).forEach((key) => {
    original[key] =
      typeof item[key] === "number"
        ? Number(found[key])
        : found[key];
  });
}

renderAllEntities();
      console.log(original);
    };

    let deleter = UI.create.button("delete", output);
    deleter.onclick = () => {
      let choice = confirm(`Are you sure you want to delete ${currentEditing}?`);
      if (!choice) return;
      entities[type] = entities[type].filter(
        (entity) => entity.name !== currentEditing,
      );
      renderAllEntities();
      document.getElementById("editEntityMenu").style.display = "none";
      lightenScreen();
    };
  }
}
