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

  let complex = confirm(
    "Do you want to add complex properties? (bounce, collideWorldBounds)",
  );

  let bounce, collideWorldBounds, bouncePower;
  if (complex) {
    bounce = confirm("bounce?");
    if(bounce) {
      bouncePower = 0.6;
    } else {
      bouncePower = 0;
    }
    collideWorldBounds = confirm("collide with world bounds?");
  } else {
    bounce = false;
    bouncePower = 0;
    collideWorldBounds = false;
  }

  addEntity("circles", {
    x: x,
    y: y,
    radius: radius,
    color: color,
    name: name,
    bounce: bounce,
    bouncePower: bouncePower,
    collideWorldBounds: collideWorldBounds,
  });
  renderAllEntities();
}

function addEmojiSprite() {
  let x = Number(prompt("x")) ?? 120;
  let y = Number(prompt("y")) ?? 70;
  let fontSize = Number(prompt("font size") ?? 64) ?? 64;
  let emoji = prompt("emoji");
  let name = prompt("name");

  addEntity("emojiSprites", {
    x: x,
    y: y,
    fontSize: fontSize,
    emoji: emoji,
    name: name,
  });
  renderAllEntities();
}

function addEmojiPlatform() {
  let x = Number(prompt("x")) ?? 120;
  let y = Number(prompt("y")) ?? 70;
  let width = Number(prompt("width")) ?? 40;
  let fontSize = Number(prompt("font size") ?? 64) ?? 64;
  let emoji = prompt("emoji");
  let name = prompt("name");

  addEntity("emojiPlatforms", {
    x: x,
    y: y,
    width: width,
    fontSize: fontSize,
    emoji: emoji,
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
  if (type === "none" || type === "platforms" || type === "emojiPlatforms") {
    alert(
      "you cannot make a platform or nothinness or emoji platform a player!",
    );
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
  } else if (type === "circles") {
    darkenScreen();
    openEdit(item, mode, "circles");
  } else if (type === "platforms") {
    darkenScreen();
    openEdit(item, mode, "platforms");
  } else if (type === "emojiSprites") {
    darkenScreen();
    openEdit(item, mode, "emojiSprites");
  } else if (type === "emojiPlatforms") {
    darkenScreen();
    openEdit(item, mode, "emojiPlatforms");
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
      let textElement = UI.create.text(itemName, output);
      textElement.style.color = "black";
      let viewedItem = item[itemName];
      if (typeof viewedItem === "number") {
        parts[itemName] = UI.create.numInput(output, viewedItem);
      } else if (typeof viewedItem === "string") {
        parts[itemName] = UI.create.strInput(output, viewedItem);
      } else if (typeof viewedItem === "boolean") {
        parts[itemName] = UI.create.checkbox(output, viewedItem);
      }
    });
    let confirmer = UI.create.button("confirm", output);
    confirmer.onclick = () => {
      let found = {};
      Object.keys(parts).forEach((partName) => {
        const input = parts[partName];
        found[partName] =
          input.type === "checkbox" ? input.checked : input.value;
      });

      const original = entities[type].find(
        (entity) => entity.name === currentEditing,
      );

      if (original) {
        Object.keys(found).forEach((key) => {
          original[key] =
            typeof item[key] === "number" ? Number(found[key]) : found[key];
        });
      }

      renderAllEntities();
      restartScene();
    };

    let deleter = UI.create.button("delete", output);
    deleter.onclick = () => {
      let choice = confirm(
        `Are you sure you want to delete ${currentEditing}?`,
      );
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
