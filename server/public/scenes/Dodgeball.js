class Dodgeball extends Phaser.Scene {

  constructor(){
      super("Dodgeball");
  }
  
  init(data){
    this.socket = data.socket;
  }

 preload() {
  //load sprites
  this.load.spritesheet("cat1", "assets/cats/Cat_1.png", {frameWidth:263, frameHeight:194});
  this.load.spritesheet("cat2", "assets/cats/Cat_2.png", {frameWidth:250, frameHeight:184});
  this.load.spritesheet("cat3", "assets/cats/Cat_3.png", {frameWidth:250, frameHeight:184});
  this.load.spritesheet("cat4", "assets/cats/Cat_4.png", {frameWidth:250, frameHeight:184});
  this.load.spritesheet("cat5", "assets/cats/Cat_5.png", {frameWidth:250, frameHeight:184});
  this.load.spritesheet("cat6", "assets/cats/Cat_6.png", {frameWidth:250, frameHeight:184});
  this.load.spritesheet("cat7", "assets/cats/Cat_7.png", {frameWidth:250, frameHeight:184});
  this.load.spritesheet("cat8", "assets/cats/Cat_8.png", {frameWidth:250, frameHeight:184});

  //load background
  this.load.image('sky', 'assets/dodgeball/spaceship.png');
  this.load.image('net', 'assets/dodgeball/platform2.png');
  this.load.image('earth', 'assets/dodgeball/earth.png');
  this.load.image('mars', 'assets/dodgeball/mars.png');
  this.load.image('saturn', 'assets/dodgeball/saturn.png');
  this.load.image('ground', 'assets/dodgeball/platform2.png');
}

 create() {
  var self = this;
  this.players = this.add.group();

  console.log("Client-side Dodgeball Running")
  this.scene.launch("Rules_Dodgeball");

  //add background
  this.add.image(400, 300, 'sky');
  this.add.image(400, 568, 'ground').setScale(2)
  this.add.image(400, 350, 'net').setScale(0.05, 7)
  this.add.image(200, 220, 'ground').setScale(.5)
  this.add.image(600, 220, 'ground').setScale(.5)
  this.add.image(200, 400, 'ground').setScale(.5)
  this.add.image(600, 400, 'ground').setScale(.5)

  // create the first ball
  var ball = this.add.sprite(400, 200, 'earth');
  var ball2 = this.add.sprite(400, 200, 'mars');
  var ball3 = this.add.sprite(400, 200, 'saturn');


  //listen for currentPlayers and self
  this.socket.on('currentPlayers_dodge', function (players) {
    Object.keys(players).forEach(function (id) {

      //if it is this client
      if (players[id].playerId === self.socket.id) {
        displayPlayers(self, players[id], players[id].cat);
      }
      //if it is another client
      else{
        displayPlayers(self,players[id],players[id].cat)
      }
    });
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
  this.socket.on('playerUpdates_dodge', function (players) {
    Object.keys(players).forEach(function (id) {
      self.players.getChildren().forEach(function (player) {
        if (players[id].playerId === player.playerId) {
          player.setPosition(players[id].x, players[id].y);
          // if (player.anims.getName() !== players[id].animationKey) {
          //   player.anims.play(players[id].animationKey, true);
          // }
          setUsername_Pos(player,players[id].x, players[id].y);
        }
      });
    });
  });

  //update ball positions
  this.socket.on('ballUpdates', function(ball_Pos) {
    // if (countdownCompleted) {
        const {ball_x, ball_y} = ball_Pos;
        ball.setPosition(ball_x, ball_y);
    // }
});

this.socket.on('ballUpdates2', function(ball2_Pos) {
    // if (countdownCompleted) {
        const {ball2_x, ball2_y} = ball2_Pos;
        ball2.setPosition(ball2_x, ball2_y);
    // }
});

this.socket.on('ballUpdates3', function(ball3_Pos) {
    // if (countdownCompleted) {
        const {ball3_x, ball3_y} = ball3_Pos;
        ball3.setPosition(ball3_x, ball3_y);
    // }
});

  //create cursors
  this.cursors = this.input.keyboard.createCursorKeys();
  this.leftKeyPressed = false;
  this.rightKeyPressed = false;
  this.upKeyPressed = false;

  const gameOverText = this.add.text(250, 150, "", {
    fill: "#000000",
    fontFamily: 'Arial',
    fontSize: "50px"
});

this.socket.on('gameOver', function(username) {
  gameOverText.setText(username + " Won")
});

this.socket.on('stopDodgeballScene', () => {
  self.scene.stop("Dodgeball");
});

}

 update() {

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
    console.log({ left: this.leftKeyPressed , right: this.rightKeyPressed, up: this.upKeyPressed })
    this.socket.emit('dodgeInput', { left: this.leftKeyPressed , right: this.rightKeyPressed, up: this.upKeyPressed });
  }
}

}