const config = {
  type: Phaser.AUTO,
  parent: "preview-screen",
  width: "100%",
  height: "100%",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: gravity },
      debug: physicsDebug,
    },
  },
  scene: {
    create: create,
    update: update,
  },
};

let platforms;
let emojiPlatforms;
let emojiSprites;
let cubes;
let circles;
let activeScene;
let player;

let arrows;

let jumpCount = 0;

function create() {
  activeScene = this;
  applyDebugState();
  this.cameras.main.setBackgroundColor(backColor);
  this.physics.world.setBounds(
    boundaries.x,
    boundaries.y,
    boundaries.width,
    boundaries.height,
  )
  this.cameras.main.setBounds(
    boundaries.x,
    boundaries.y,
    boundaries.width,
    boundaries.height,
  );

  // RENDERING CUBES
  cubes = this.physics.add.group();

  entities.cubes.forEach((cube) => {
    let cubeObject = this.add.rectangle(
      cube.x,
      cube.y,
      cube.width,
      cube.height,
      cube.color,
    );

    this.physics.add.existing(cubeObject);
    cube.gameObject = cubeObject;

    cubes.add(cubeObject);
  });

  // RENDERING CIRCLES
  circles = this.physics.add.group();

  entities.circles.forEach((circle) => {
    let circleObject = this.add.circle(
      circle.x,
      circle.y,
      circle.radius,
      circle.color,
    );
    
    this.physics.add.existing(circleObject)

    circleObject.body.setCircle(circle.radius);
    circle.gameObject = circleObject;

    circles.add(circleObject);

    if(circle.bounce) {
      console.log("setting bounce for circle", circleObject);
      circleObject.body.setBounce(circle.bouncePower);  
    }
    if(circle.collideWorldBounds) {
      circleObject.body.setCollideWorldBounds(true);
    }
  });

  // RENDERING EMOJI SPRITES
  emojiSprites = this.physics.add.group();

  entities.emojiSprites.forEach((emoji)=>{
    let emojiObj = this.add.text(emoji.x, emoji.y, emoji.emoji, {
      fontSize: `${emoji.fontSize}px`
    })
    emojiObj.setOrigin(0.5);

    this.physics.add.existing(emojiObj);

    emoji.gameObject = emojiObj;
    emojiSprites.add(emojiObj);
  });
  
  // RENDERING EMOJI PLATFORMS
  emojiPlatforms = this.physics.add.staticGroup();

  entities.emojiPlatforms.forEach((platform) => {
    const targetWidth = platform.width;
    const sprite = platform.emoji;

    const tempObj = this.add.text(platform.x, platform.y, sprite, {
      fontSize: `${platform.fontSize}px`
    });

    tempObj.setOrigin(0.5);

    const itemWidth = tempObj.width;
    tempObj.destroy();

    const repeatCount = Math.max(1, Math.floor(targetWidth / itemWidth));

    const platformObj = this.add.text(platform.x, platform.y, sprite.repeat(repeatCount), {
      fontSize: `${platform.fontSize}px`
    });

    platformObj.setOrigin(0.5);

    platform.gameObject = platformObj;
    emojiPlatforms.add(platformObj);
  });
  
  this.physics.add.collider(cubes, emojiPlatforms);
  this.physics.add.collider(circles, emojiPlatforms);
  this.physics.add.collider(emojiSprites, emojiPlatforms);

  // MAKING PLATFORMS
  platforms = this.physics.add.staticGroup();

  entities.platforms.forEach((platform) => {
    let platformObj = this.add.rectangle(
      platform.x,
      platform.y,
      platform.width,
      platform.height,
      platform.color,
    );

    platform.gameObject = platformObj;
    platforms.add(platformObj);
  });

  this.physics.add.collider(cubes, platforms);
  this.physics.add.collider(circles, platforms);
  this.physics.add.collider(emojiSprites, platforms);

  // INITIALIZING PLAYER
  arrows = this.input.keyboard.createCursorKeys();

  if (currentPlayer && currentPlayer.gameObject) {
    player = currentPlayer.gameObject;
    cubes.remove(player, false, false);
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, emojiPlatforms);
    this.cameras.main.startFollow(player);
  }
}

function update() {
  if (player && player.body) {
    if (arrows.left.isDown) {
      player.body.setVelocityX(-movement.speed);
    } else if (arrows.right.isDown) {
      player.body.setVelocityX(movement.speed);
    } else {
      player.body.setVelocityX(0);
    }

    if (player.body.blocked.down) {
      jumpCount = 0;
    }

    if (
      (Phaser.Input.Keyboard.JustDown(arrows.space) ||
        Phaser.Input.Keyboard.JustDown(arrows.up)) &&
      jumpCount < movement.maxPlayerJumps
    ) {
      player.body.setVelocityY(-movement.jumpPower);
      jumpCount++;
    }
  }
}

const game = new Phaser.Game(config);
