let gravity = 300;
let physicsDebug = true;

let entities = {
  cubes: [],
  circles: [],
  platforms: [],
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
