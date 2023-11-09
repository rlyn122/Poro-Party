var config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

function preload() {
  //load sprites
  this.load.spritesheet("cat1", "assets/cats/Cat_1.png", {frameWidth:263, frameHeight:194});
  this.load.spritesheet("cat7", "assets/cats/Cat_7.png", {frameWidth:250, frameHeight:184});
  this.load.spritesheet("cat8", "assets/cats/Cat_8.png", {frameWidth:250, frameHeight:184});

  //load background
  this.load.image('sky', 'assets/volleyball/sky.png');
  this.load.image('net', 'assets/volleyball/platform2.png');
  this.load.image('ball', 'assets/volleyball/volleyball.png');
  this.load.image('ground', 'assets/volleyball/platform.png');
}

function create() {
  var self = this;
  this.socket = io();
  this.players = this.add.group();

  //add background

  var ball;
  var gameOver = false;
  var platforms;

  this.add.image(400, 300, 'sky');
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  platforms.create(400, 350, 'net').setScale(0.05, 7).refreshBody();

  ball = this.physics.add.sprite(400, 200, 'ball');
  ball.setBounce(1);
  ball.setCollideWorldBounds(true);
  ball.setVelocityX(100);

  var graphics = this.add.graphics();
  graphics.lineStyle(8, 0xFFFF00, 0.6); // Yellow color with a bit of transparency

  // Draw a rectangle around the game boundaries
  graphics.strokeRect(4, 4, 792, 592); // Adjust the rectangle's position and size


  //listen for currentPlayers and self
  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {

      //if it is this client
      if (players[id].playerId === self.socket.id) {
        displayPlayers(self, players[id], 'cat8');
      }
      //if it is another client
      else{
        displayPlayers(self,players[id],'cat7')
      }
    });
  });

  //listen for newPlayer connection
  this.socket.on('newPlayer', function (playerInfo) {
    displayPlayers(self, playerInfo, 'cat7');
  });

  //listen for player disconnection
  this.socket.on('disconnect', function (playerId) {
    self.players.getChildren().forEach(function (player) {
      if (playerId === player.playerId) {
        player.destroy();
      }
    });
  });

  //update player movements from server
  this.socket.on('playerUpdates', function (players) {
    Object.keys(players).forEach(function (id) {
      self.players.getChildren().forEach(function (player) {
        if (players[id].playerId === player.playerId) {
          player.setPosition(players[id].x, players[id].y);
        }
      });
    });
  });

  this.socket.on('ballUpdates', function(ball_Pos) {
    const {ball_x, ball_y} = ball_Pos;
    ball.setPosition(ball_x,ball_y)
  })

  //create cursors
  this.cursors = this.input.keyboard.createCursorKeys();
  this.leftKeyPressed = false;
  this.rightKeyPressed = false;
  this.upKeyPressed = false;
}

function update() {

  const left = this.leftKeyPressed;
  const right = this.rightKeyPressed;
  const up = this.upKeyPressed;

  //handle cursor inputs
  if (this.cursors.left.isDown) {
    this.leftKeyPressed = true;
  } else if (this.cursors.right.isDown) {
    this.rightKeyPressed = true;
  } else {
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
  }
  if (this.cursors.up.isDown) {
    this.upKeyPressed = true;
  } else {
    this.upKeyPressed = false;
  }
  //if the state of a key has been changed, emit the state of keys to server
  if ( left !== this.leftKeyPressed || right !== this.rightKeyPressed || up !== this.upKeyPressed) {
    this.socket.emit('playerInput', { left: this.leftKeyPressed , right: this.rightKeyPressed, up: this.upKeyPressed });
  }
}


//displays  
function displayPlayers(self, playerInfo, sprite) {
  const player = self.add.sprite(playerInfo.x, playerInfo.y, sprite).setScale(0.2,0.2);
  player.playerId = playerInfo.playerId;
  self.players.add(player);
}