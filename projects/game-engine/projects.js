let savedData = {};

function randomGameName() {
  const starts = [
    "Amazing",
    "Incredible",
    "Fantastic",
    "Epic",
    "Legendary",
    "Mysterious",
    "Furious",
    "Brilliant",
    "Savage",
    "Majestic",
    "Enchanted",
    "Frosty",
    "Galactic",
    "Infernal",
    "Radiant",
    "Shadowy",
    "Thunderous",
    "Vicious",
    "Whimsical",
    "Zealous",
  ];
  const ends = [
    "Quest",
    "Adventure",
    "Saga",
    "Odyssey",
    "Chronicles",
    "Expedition",
    "Journey",
    "Battle",
    "War",
    "Clash",
    "Conquest",
    "Rebellion",
    "Uprising",
    "Legacy",
    "Empire",
    "Kingdom",
    "Realm",
    "Frontier",
    "Voyage",
    "Mystery",
  ];
  const start = starts[Math.floor(Math.random() * starts.length)];
  const end = ends[Math.floor(Math.random() * ends.length)];
  return `${start}${end}`;
}

async function saveGame() {
  let savedDataPotential = await localforage.getItem("moonGameSave");
  if (savedDataPotential) {
    savedData = savedDataPotential;
  }

  let projectName;
  let tryName = document.getElementById("projectNameInput").value;
  if (tryName) {
    projectName = tryName;
  } else {
    projectName = randomGameName();
  }
  savedData[projectName] = JSON.parse(
    JSON.stringify(
      {
        name: projectName,
        entities,
        worldBounds: boundaries,
        player: currentPlayer,
        movement,
        backColor,
        deathOnVoid,
        playerStats
      },
      (key, value) => (key === "gameObject" ? undefined : value),
    ),
  );

  await localforage.setItem("moonGameSave", savedData);

  renderAllLoaded();
  alert(`Saved project as: ${projectName}`);
}

async function renderAllLoaded() {
  const field = document.getElementById("projectsList");
  field.replaceChildren();

  let potentialSave = await localforage.getItem("moonGameSave");
  if (potentialSave) {
    savedData = potentialSave;
  }

  Object.keys(savedData).forEach((save) => {
    let container = UI.create.box(field);
    container.classList.add("downList");
    container.classList.add("loadItem");

    UI.create.boldText(save, container);

    let loaded = savedData[save];

    UI.create.text(`name: ${loaded.name}`, container);

    let loadBtn = UI.create.button("Load", container);
    loadBtn.onclick = () => {
      loadProject(loaded);
    };
  });
}

function loadProject(load) {
  if (!load) {
    alert("No project to load");
    return;
  }

  if (load.entities) {
    if (load.entities.cubes) {
      entities.cubes = load.entities.cubes;
    }
    if (load.entities.circles) {
      entities.circles = load.entities.circles;
    }
    if (load.entities.emojiSprites) {
      entities.emojiSprites = load.entities.emojiSprites;
    }
    if (load.entities.platforms) {
      entities.platforms = load.entities.platforms;
    }
    if (load.entities.emojiPlatforms) {
      entities.emojiPlatforms = load.entities.emojiPlatforms;
    }
  }

  if (load.worldBounds) {
    boundaries = load.worldBounds;
  }

  if (load.player) {
    currentPlayer =
      Object.values(entities)
        .flat()
        .find((entity) => entity.name === load.player.name) ?? null;
  } else {
    currentPlayer = null;
  }

  restartScene();

  if (load.movement) {
    movement = load.movement;
  }

  if (load.name) {
    document.getElementById("projectNameInput").value = load.name;
  }

  if (load.backColor) {
    backColor = load.backColor;
  }

  if(load.deathOnVoid) {
    deathOnVoid = load.deathOnVoid;
  }

  if(load.playerStats) {
    playerStats = load.playerStats;
  }

  renderAllEntities();
  renderAllLoaded();
  restartScene();
  alert(`Loaded project: ${load.name}`);
}

renderAllLoaded();
