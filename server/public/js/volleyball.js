import Phaser from "phaser";

export default class Volleyball extends Phaser.Scene {

constructor(){
  super("Volleyball");
}

init(socket){
  this.socket = socket;
}

preload() {
  //load sprites
  this.load.spritesheet('cat', 'assets/volleyball/Cat_1.png', { frameWidth: 263, frameHeight: 192 });  

  //load background
  this.load.image('sky', 'assets/volleyball/sky.png');
  this.load.image('net', 'assets/volleyball/platform2.png');
  this.load.image('ball', 'assets/volleyball/volleyball.png');
  this.load.image('ground', 'assets/volleyball/platform.png');
}

create() {
  var self = this;
  this.socket = io();
  this.players = this.add.group();

  //add background

  var ball;

  this.add.image(400, 300, 'sky');
  this.add.image(400, 568, 'ground').setScale(2)
  this.add.image(400, 350, 'net').setScale(0.05, 7)

  ball = this.add.sprite(400, 200, 'ball');

  var graphics = this.add.graphics();
  graphics.lineStyle(8, 0xFFFF00, 0.6); // Yellow color with a bit of transparency

  // Draw a rectangle around the game boundaries
  graphics.strokeRect(4, 4, 792, 592); // Adjust the rectangle's position and size



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

update() {

  const left = this.leftKeyPressed;
  const right = this.rightKeyPressed;
  const up = this.upKeyPressed;

  //handle cursor inputs
  if (this.cursors.left.isDown) {
    this.leftKeyPressed = true;
    this.rightKeyPressed = false;
    this.upKeyPressed = false;
  } else if (this.cursors.right.isDown) {
    this.rightKeyPressed = true;
    this.leftKeyPressed = false;
    this.upKeyPressed = false;
  } else {
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
displayPlayers(self, playerInfo, sprite) {
  const player = self.add.sprite(playerInfo.x, playerInfo.y, sprite).setScale(0.2,0.2);

  self.anims.create({
    key: 'left',
    frames: self.anims.generateFrameNumbers('cat', { start: 0, end: 1 }),
    frameRate: 5,
    repeat: -1
  });

  self.anims.create({
    key: 'turn',
    frames: [{ key: 'cat', frame: 2 }],
    frameRate: 20
  });

  self.anims.create({
    key: 'right',
    frames: self.anims.generateFrameNumbers('cat', { start: 2, end: 3 }),
    frameRate: 5,
    repeat: -1
  });

  player.playerId = playerInfo.playerId;
  self.players.add(player);
}

}