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
  this.load.image('sky', 'assets/soccer/spaceship.png');
  this.load.image('net', 'assets/soccer/platform2.png');
  this.load.image('mars', 'assets/soccer/mars.png');
  this.load.image('ground', 'assets/soccer/platform2.png');
  this.load.image('goal', 'assets/soccer/goal.png');
}

function create() {
  var self = this;
  this.socket = io();
  this.players = this.add.group();

  //add background

  this.add.image(400, 300, 'sky').setScale(0.53);
  this.add.image(400, 568, 'ground').setScale(2)

  let blueScore = 0;
  let redScore = 0;

  // //left sprite
  // this.add.image(20, 460, 'net').setScale(0.02, 5)
  // this.add.image(30, 360, 'net').setScale(0.02, 0.5)
  // this.add.image(40, 340, 'net').setScale(0.02, 0.5)
  // this.add.image(50, 330, 'net').setScale(0.02, 0.5)
  // this.add.image(60, 310, 'net').setScale(0.02, 0.5)
  // this.add.image(70, 295, 'net').setScale(0.02, 0.5)
  // this.add.image(80, 280, 'net').setScale(0.02, 0.5)

  // this.add.image(30, 380, 'net').setScale(0.02, 0.5)
  // this.add.image(40, 360, 'net').setScale(0.02, 0.5)
  // this.add.image(50, 350, 'net').setScale(0.02, 0.5)
  // this.add.image(60, 330, 'net').setScale(0.02, 0.5)
  // this.add.image(70, 315, 'net').setScale(0.02, 0.5)
  // this.add.image(80, 300, 'net').setScale(0.02, 0.5)

  // //right sprite
  // this.add.image(730, 460, 'net').setScale(0.02, 5)
  // this.add.image(720, 380, 'net').setScale(0.02, 3)
  // this.add.image(705, 350, 'net').setScale(0.02, 3)
  // this.add.image(690, 330, 'net').setScale(0.02, 3)
  // this.add.image(670, 330, 'net').setScale(0.02, 3)


  this.add.image(50, 415, 'goal').setScale(.1).setDepth(1);
  this.add.image(750, 415, 'goal').setScale(-0.1, .1).setDepth(1);

  // create the first ball
  ball = this.add.sprite(400, 200, 'mars').setScale(2);

  // Create text objects to display scores
  this.blueScoreText = this.add.text(640, 16, 'Blue: 0', {
    fontSize: '32px',
    fill: '#0000FF',
  });
  this.redScoreText = this.add.text(16, 16, 'Red: 0', {
    fontSize: '32px',
    fill: '#FF0000',
  });

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

  //update player movements and animations from server
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

  //score updates
  this.socket.on('scoreUpdate', function (scores) {
    self.blueScoreText.setText(`Blue: ${scores.blueScore}`);
    self.redScoreText.setText(`Red: ${scores.redScore}`);
  });

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
  ball2 = this.add.sprite(300, 200, 'mars');
}

function createThirdBall() {
  ball3 = this.add.sprite(400, 300, 'saturn');
}