let gravity = 300;
let physicsDebug = true;

let entities = {
    cubes: [],
    circles: [],
    platforms: []
};

let currentPlayer = null;

let boundaries = {
    x: 0,
    y: -100,
    width: 3000,
    height: 600
}

let currentEditing = null;

let movement = {
    maxPlayerJumps: 2,
    speed: 250,
    jumpPower: 250
}
