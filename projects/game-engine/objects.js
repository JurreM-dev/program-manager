let gravity = 300;
let physicsDebug = true;

let backColor = "#87CEEB";

let entities = {
  cubes: [],
  circles: [],
  platforms: [],
  emojiSprites: [],
  emojiPlatforms: []
};

let currentPlayer = null;

let boundaries = {
  x: 0,
  y: -500,
  width: 5000,
  height: 1500,
};

let currentEditing = null;

let movement = {
  maxPlayerJumps: 2,
  speed: 250,
  jumpPower: 250,
};

let deathOnVoid = true;

let playerStats = {
  hp: 10,
  maxHp: 10
}