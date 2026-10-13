const config = {
    type: Phaser.AUTO,
    parent: 'preview-screen',
    width: '100%',
    height: '100%',
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: gravity },
            debug: physicsDebug
        }
    },
    scene: {
        create
    }
};

function create() {
     this.cameras.main.setBackgroundColor("#87CEEB");

     entities.cubes.forEach((cube) => {
        let cubeObject = this.add.rectangle(cube.x, cube.y, cube.width, cube.height, cube.color)

        this.physics.add.existing(cubeObject);
     })
}

const game = new Phaser.Game(config);