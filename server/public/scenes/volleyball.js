var config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);
var ball;
var ball2;
var ball3;

function preload() {
  //load sprites
  this.load.spritesheet('cat', 'assets/cats/Cat_1.png', { frameWidth: 263, frameHeight: 192 });  
  this.load.spritesheet('cat2', 'assets/cats/Cat_2.png', { frameWidth: 263, frameHeight: 192 });  
  this.load.spritesheet('cat3', 'assets/cats/Cat_3.png', { frameWidth: 263, frameHeight: 192 });  
  this.load.spritesheet('cat4', 'assets/cats/Cat_4.png', { frameWidth: 263, frameHeight: 192 });  
  this.load.spritesheet('cat5', 'assets/cats/Cat_5.png', { frameWidth: 263, frameHeight: 192 });  
  this.load.spritesheet('cat6', 'assets/cats/Cat_6.png', { frameWidth: 263, frameHeight: 192 });  
  this.load.spritesheet('cat7', 'assets/cats/Cat_7.png', { frameWidth: 263, frameHeight: 192 });  
  this.load.spritesheet('cat8', 'assets/cats/Cat_8.png', { frameWidth: 263, frameHeight: 192 });  


  //load background
  this.load.image('sky', 'assets/volleyball/spaceship.png');
  this.load.image('net', 'assets/volleyball/platform2.png');
  this.load.image('earth', 'assets/volleyball/earth.png');
  this.load.image('mars', 'assets/volleyball/mars.png');
  this.load.image('saturn', 'assets/volleyball/saturn.png');
  this.load.image('ground', 'assets/volleyball/platform2.png');
}

function create() {
  var self = this;
  this.socket = io();
  this.players = this.add.group();

  //add background

  this.add.image(400, 300, 'sky');
  this.add.image(400, 568, 'ground').setScale(2)
  this.add.image(400, 350, 'net').setScale(0.05, 7)
  this.add.image(200, 220, 'ground').setScale(.5)
  this.add.image(600, 220, 'ground').setScale(.5)
  this.add.image(200, 400, 'ground').setScale(.5)
  this.add.image(600, 400, 'ground').setScale(.5)

  // create the first ball
  ball = this.add.sprite(400, 200, 'earth');
  ball2 = this.add.sprite(400, 200, 'mars');
  ball3 = this.add.sprite(400, 200, 'saturn');

  // create the second ball 15 seconds after
  this.time.delayedCall(15000, createSecondBall, [], this);

  // Create the third ball after 30 seconds (15 seconds after the second ball)
  this.time.delayedCall(30000, createThirdBall, [], this);

  //listen for currentPlayers and self
  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {

      //if it is this client
      if (players[id].playerId === self.socket.id) {
        displayPlayers(self, players[id], 'cat');
      }
      //if it is another client
      else{
        displayPlayers(self,players[id],'cat')
      }
    });
  });

  //listen for newPlayer connection
  this.socket.on('newPlayer', function (playerInfo) {
    displayPlayers(self, playerInfo, 'cat');
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
          if (player.anims.getCurrentKey() !== players[id].animationKey) {
            player.anims.play(players[id].animationKey, true);
          }
        }
      });
    });
  });

  //update ball positions
  this.socket.on('ballUpdates', function(ball_Pos) {
    const {ball_x, ball_y} = ball_Pos;
    ball.setPosition(ball_x,ball_y)
  })

  this.socket.on('ballUpdates2', function(ball2_Pos) {
    const {ball2_x, ball2_y} = ball2_Pos;
    ball2.setPosition(ball2_x,ball2_y)
  })

  this.socket.on('ballUpdates3', function(ball3_Pos) {
    const {ball3_x, ball3_y} = ball3_Pos;
    ball3.setPosition(ball3_x,ball3_y)
  })

  //create cursors
  this.cursors = this.input.keyboard.createCursorKeys();
  this.leftKeyPressed = false;
  this.rightKeyPressed = false;
  this.upKeyPressed = false;

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 1 }),
    frameRate: 5,
    repeat: -1
  });

  this.anims.create({
    key: 'look_right',
    frames: [{ key: 'cat', frame: 2 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'look_left',
    frames: [{ key: 'cat', frame: 1 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('cat', { start: 2, end: 3 }),
    frameRate: 5,
    repeat: -1
  });

}

function update() {

  const left = this.leftKeyPressed;
  const right = this.rightKeyPressed;
  const up = this.upKeyPressed;

  //handle cursor inputs
  //added new movements and cleaned up control/inputs
  if (this.cursors.right.isDown) {
    this.rightKeyPressed = true;
    this.leftKeyPressed = false;
    this.upKeyPressed = false;
  } 
  else if (this.cursors.left.isDown) {
    this.leftKeyPressed = true;
    this.rightKeyPressed = false;
    this.upKeyPressed = false;
  } 
  else{
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
    this.upKeyPressed = false;
  }
  if (this.cursors.up.isDown) {
    this.upKeyPressed = true;
  }
  //if the state of a key has been changed, emit the state of keys to server
  if ( left !== this.leftKeyPressed || right !== this.rightKeyPressed || up !== this.upKeyPressed) {
    this.socket.emit('playerInput', { left: this.leftKeyPressed , right: this.rightKeyPressed, up: this.upKeyPressed });
  }
}

//displays  
function displayPlayers(self, playerInfo, sprite) {
  const player = self.add.sprite(playerInfo.x, playerInfo.y, sprite).setScale(0.15,0.15)

  player.playerId = playerInfo.playerId;
  self.players.add(player);
}

function createSecondBall() {
  ball2 = this.add.sprite(400, 200, 'mars');
}

function createThirdBall() {
  ball3 = this.add.sprite(400, 200, 'saturn');
}