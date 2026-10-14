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

let platforms;
let cubes;
let circles;
let activeScene;

function create() {
     activeScene = this;
     this.cameras.main.setBackgroundColor("#87CEEB");

     // RENDERING CUBES
     cubes = this.physics.add.group();

     entities.cubes.forEach((cube) => {
        let cubeObject = this.add.rectangle(cube.x, cube.y, cube.width, cube.height, cube.color);

        this.physics.add.existing(cubeObject);

        cubes.add(cubeObject);
     })

    // RENDERING CIRCLES
    circles = this.physics.add.group();

     entities.circles.forEach((circle) => {
        let circleObject = this.add.circle(circle.x, circle.y, circle.radius, circle.color);

        this.physics.add.existing(circleObject);

        circleObject.body.setCircle(circle.radius);

        circles.add(circleObject);
     });

     // MAKING PLATFORMS
     platforms = this.physics.add.staticGroup();

     entities.platforms.forEach((platform) => {
        let platformObj = this.add.rectangle(platform.x, platform.y, platform.width, platform.height, platform.color);

        platforms.add(platformObj);
     })

     this.physics.add.collider(cubes, platforms);
     this.physics.add.collider(circles, platforms);
}

const game = new Phaser.Game(config);