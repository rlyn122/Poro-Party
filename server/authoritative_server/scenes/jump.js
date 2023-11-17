const players = {};

const config = {
    type: Phaser.HEADLESS,
    parent: 'game',
    width: 900,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
      },
};

////////


function preload() {
    this.load.spritesheet('hero', 'assets/cat.png', { frameWidth: 263, frameHeight: 192 });
    this.load.image('pixel', 'assets/pixel_1.png');
    this.load.image('background', 'assets/background4.jpg');

    for (let i = 1; i <= 5; i++) {
        this.load.image('platform' + i, 'assets/platform' + i + '.png');
    }

}


function create() {
    //this.cameras.main.setBackgroundColor('#6bf');

    //let background = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'background');
    //background.setScale(this.cameras.main.width / background.width, this.cameras.main.height / background.height);
    //background.setDepth(-2);  // Ensure the background is behind all other game elements
    //background.setScrollFactor(0);
    const self = this;

    this.players = this.add.group();
    this.backgroundanime();
    
    this.cameraYMin = 99999;
    this.platformYMin = 99999;

    this.platformsCreate();

    this.physics.world.setBounds(0, -20000, this.cameras.main.width, 40000);

    this.cursor = this.input.keyboard.createCursorKeys();

    io.on('connection', function(socket) {
        console.log('a user connected: ' + socket.id);

        // create a new player
        players[socket.id] = {
            x: Math.floor(0.5 * this.cameras.main.width),
            y: this.cameras.main.height - 36,
            playerId: socket.id,
            input: {
                left: false,
                right: false,
                up: false
            }
        };

        // add player to server
        addPlayer(self, players[socket.id]);

        // send the players object to the new player
        socket.emit('currentPlayers', players);

        // update all other players of the new player
        socket.broadcast.emit('newPlayer', players[socket.id]);

        // disconnet
        socket.on('disconnect', function() {
            console.log('user disconnected: ' + socket.id);

            removePlayer(this, socket.id);

            delete players[socket.id];

            io.emit('disconnect', socket.id);
        });

        // update player data
        socket.on('playerInput', function(inputData) {
            handlePlayerInput(players[socket.id], inputData);
        });

    });

    this.physics.add.collider(this.players, this.platforms);
    this.physics.add.collider(this.players, this.players);

}

function update() {
    this.cameras.main.setBounds(0, -this.hero.yChange, this.cameras.main.width, this.cameras.main.height + this.hero.yChange);


    // moving camera according to the highest character
    const higherHeroY = Math.min(this.hero.y, this.hero2.y);

    if (typeof this.maxHeightReached === 'undefined' || higherHeroY < this.maxHeightReached) {
        this.maxHeightReached = higherHeroY;
    }
    
    this.hero.yChange = Math.max(this.hero.yChange, Math.abs(this.hero.y - this.hero.yOrig));
    this.hero2.yChange = Math.max(this.hero2.yChange, Math.abs(this.hero2.y - this.hero2.yOrig));
    
    const higherYChange = Math.max(this.hero.yChange, this.hero2.yChange);
    this.cameras.main.setBounds(0, -higherYChange, this.cameras.main.width, this.cameras.main.height + higherYChange);
    
    // setting camera's scrollY with maxHeightReached
    this.cameras.main.scrollY = this.maxHeightReached - this.cameras.main.height + 300;


    let keys = this.input.keyboard.addKeys('W,A,S,D');

    if (keys.A.isDown) {
        this.hero2.body.setVelocityX(-250);
    } else if (keys.D.isDown) {
        this.hero2.body.setVelocityX(250);
    } else {
        this.hero2.body.setVelocityX(0);
    }
    
    if (keys.W.isDown && this.hero2.body.touching.down) {
        this.hero2.body.setVelocityY(-400);
    }

    if (this.cursor.left.isDown) {
        this.hero.body.setVelocityX(-250);
        this.hero.anims.play('left-walk', true);
        this.lastDirection = 'left';
    } else if (this.cursor.right.isDown) {
        this.hero.body.setVelocityX(250);
        this.hero.anims.play('right-walk', true);
        this.lastDirection = 'right'; 
    } else {
        this.hero.body.setVelocityX(0);
        if (this.lastDirection === 'left') {
            this.hero.anims.play('left-stand');
        } else {
            this.hero.anims.play('right-stand');
        }
    }
    

    if (this.cursor.up.isDown && this.hero.body.touching.down) {
        this.hero.body.setVelocityY(-400);
    }

    this.physics.world.wrap(this.hero, 20);

    this.hero.yChange = Math.max(this.hero.yChange, Math.abs(this.hero.y - this.hero.yOrig));



    this.platforms.getChildren().forEach(platform => {
        if (this.hero.body.touching.down && platform.getBounds().contains(this.hero.x, this.hero.y - 1)) {
            this.lastPlatformY = platform.y;
        }
    });

    // falling off the screen
    if (this.hero.y > this.cameras.main.scrollY + this.cameras.main.height+110 || 
        this.hero2.y > this.cameras.main.scrollY + this.cameras.main.height+110) {
        this.bgm.stop();
        this.scene.restart();
    }


    
    
    // ADD BLOCKS
    let highestPlatform = this.cameras.main.height;
    this.platforms.getChildren().forEach(function(platform) {
        highestPlatform = Math.min(highestPlatform, platform.y);
    });

    if (highestPlatform > this.cameras.main.scrollY + 100) {
        let x;
        let y;
        do {
            x = Phaser.Math.Between(0, this.cameras.main.width - 50);
            y = highestPlatform - Phaser.Math.Between(60, 100);
        } while (this.isOverlappingWithClouds(x, y));
        
        let platformType = 'platform' + Phaser.Math.Between(1, 5);
        let platform = this.platforms.create(x, y, platformType);
        platform.setScale(0.07).refreshBody();
    }

    this.platforms.getChildren().forEach(platform => {
        if (platform.y > this.cameras.main.height) {
            platform.destroy();
        }
    });

}


function backgroundanime() {
    let frames = [];
    for (let i = 1; i <= 49; i++) {
        frames.push({ key: 'gif_frame_' + i });
    }
    
    this.anims.create({
        key: 'gif_animation',
        frames: frames,
        frameRate: 8,
        repeat: -1
    });
    
    let gifSprite = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'gif_frame_1');
    gifSprite.setScrollFactor(0);
    gifSprite.setScale(1.25);
    gifSprite.setDepth(-100);
    gifSprite.play('gif_animation');
}

function addPlayer(self, playerInfo) {
    const player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'hero');
    player.setOrigin(0.5);
    player.setScale(0.13);
    player.playerId = playerInfo.playerId; // player id bind with sprite

    // physics
    self.physics.add.existing(player);
    player.body.setGravityY(500);
    player.body.checkCollision.up = false;
    player.body.checkCollision.left = true;
    player.body.checkCollision.right = true;

    // animation
    self.anims.create({
        key: 'left-stand',
        frames: [{ key: 'hero', frame: 1 }],
        frameRate: 10
    });

    self.anims.create({
        key: 'right-stand',
        frames: [{ key: 'hero', frame: 2 }],
        frameRate: 5
    });

    self.anims.create({
        key: 'left-walk',
        frames: [{ key: 'hero', frame: 0 }],
        frameRate: 5,
        repeat: -1
    });

    self.anims.create({
        key: 'right-walk',
        frames: [{ key: 'hero', frame: 3 }],
        frameRate: 5,
        repeat: -1
    });
    

    // collision detect
    self.physics.add.collider(player, self.platforms);

    self.players.add(player);
}

function platformsCreate() {
    this.platforms = this.physics.add.staticGroup();

    let bottomPlatformType = 'platform' + Phaser.Math.Between(1, 4);
    let bottomPlatform = this.platforms.create(this.cameras.main.width / 2, this.cameras.main.height - 8, bottomPlatformType);
    bottomPlatform.setScale(0.15).refreshBody();

    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 2; j++) {
            let x = Phaser.Math.Between(j * this.cameras.main.width / 2, (j + 1) * this.cameras.main.width / 2 - 50);
            let y = this.cameras.main.height - 100 - 80 * i;
            let platformType = 'platform' + Phaser.Math.Between(1, 5);
            let platform = this.platforms.create(x, y, platformType);
            platform.setScale(0.07).refreshBody();
        }
        
    }
}


const game = new Phaser.Game(config);
// function addPlayer(self, playerInfo) {
//     const player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'hero'); // use 'hero' sprite
//     player.playerId = playerInfo.playerId;
//     self.players.add(player);
//     player.setBounce(0.2);
//     player.setScale(0.13); // Adjust scale to match your game
//     player.setCollideWorldBounds(true);
//   }
  
//   function handlePlayerInput(self, playerId, input) {
//     self.players.getChildren().forEach((player) => {
//       if (playerId === player.playerId) {
//         players[player.playerId].input = input;
//         // Handle movement and jumping based on input
//         if (input.left) {
//           player.setVelocityX(-250);
//         } else if (input.right) {
//           player.setVelocityX(250);
//         } else {
//           player.setVelocityX(0);
//         }
//         if (input.up && player.body.touching.down) {
//           player.setVelocityY(-400);
//         }
//       }
//     });
//   }