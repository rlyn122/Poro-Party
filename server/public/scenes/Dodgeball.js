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
  this.load.image('dodge_background', 'assets/dodgeball/spaceship.png');
  this.load.image('net', 'assets/dodgeball/platform2.png');
  this.load.image('earth', 'assets/dodgeball/earth.png');
  this.load.image('mars', 'assets/dodgeball/mars.png');
  this.load.image('saturn', 'assets/dodgeball/saturn.png');
  this.load.image('dodge_ground', 'assets/dodgeball/platform2.png');

  //sounds
  this.load.audio('dodge_bgm', 'assets/sounds/dodgeball.mp3');
}

 create() {
  var dodge_self = this;
  this.players = this.add.group();

  console.log("Client-side Dodgeball Running")
  this.scene.launch("Rules_Dodgeball");

  //add background
  this.add.image(400, 300, 'dodge_background');
  this.add.image(400, 568, 'dodge_ground').setScale(2)
  this.add.image(400, 350, 'net').setScale(0.05, 7)
  this.add.image(200, 220, 'dodge_ground').setScale(.5)
  this.add.image(600, 220, 'dodge_ground').setScale(.5)
  this.add.image(200, 400, 'dodge_ground').setScale(.5)
  this.add.image(600, 400, 'dodge_ground').setScale(.5)

  //sounds
  this.dodge_bgm = this.sound.add('dodge_bgm');
  this.dodge_bgm.play({
      loop: true
  });
  this.dodge_bgm.volume = 0.12;



  // create the first ball
  var ball = this.add.sprite(400, 200, 'earth');
  var ball2 = this.add.sprite(400, 200, 'mars');
  var ball3 = this.add.sprite(400, 200, 'saturn');


  //listen for currentPlayers and self
  this.socket.on('currentPlayers_dodge', function (players) {
    console.log("currentPlayers receieved")
    Object.keys(players).forEach(function (id) {
      dodge_self.displayPlayers(dodge_self, players[id], players[id].cat);
    });
  });

  //listen for player disconnection
  this.socket.on('disconnect_dodgeball', function (playerId) {
    dodge_self.players.getChildren().forEach(function (player) {
      if (playerId === player.playerId) {
        player.usernameText.destroy();
        player.destroy();
      }
    });
  });

  //update player movements and animations from server
  this.socket.on('playerUpdates_dodge', function (players) {
    Object.keys(players).forEach(function (id) {
      dodge_self.players.getChildren().forEach(function (player) {
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
    const {ball_x, ball_y} = ball_Pos;
    ball.setPosition(ball_x, ball_y);
});

this.socket.on('ballUpdates2', function(ball2_Pos) {
  const {ball2_x, ball2_y} = ball2_Pos;
  ball2.setPosition(ball2_x, ball2_y);
});

this.socket.on('ballUpdates3', function(ball3_Pos) {
  const {ball3_x, ball3_y} = ball3_Pos;
  ball3.setPosition(ball3_x, ball3_y);
});

  //create cursors
  this.cursors = this.input.keyboard.createCursorKeys();
  this.leftKeyPressed = false;
  this.rightKeyPressed = false;
  this.upKeyPressed = false;

  const centerX = this.scale.width * 0.5;
  const centerY = this.scale.height * 0.5;

  const gameOverTextStyle = {
      font: '50px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 5,
      shadow: { offsetX: 3, offsetY: 3, color: '#333', blur: 5, stroke: true, fill: true }
  };

  this.dodge_gameOverText = this.add.text(centerX, centerY, '', gameOverTextStyle).setOrigin(0.5, 0.5).setVisible(false);

this.socket.on('gameOver_Dodge', (username) => {
  if(username === null) { username = "Unknown" }

  console.log(username)

  if(this.dodge_gameOverText) {
    this.dodge_gameOverText.setText(username + " Won").setFill('#ff0000').setVisible(true);
    this.tweens.add({
      targets: this.dodge_gameOverText,
      y: centerY - 100,
      alpha: { start: 0, to: 1 }, 
      scale: { start: 0.5, to: 1.2 },
      duration: 1500,
      ease: 'Cubic.easeOut',
      onComplete: () => {
      }
    });
  } else {
    console.error('dodge_gameOverText is not defined.');
  }
});

this.socket.on('stopDodgeballScene', () => {
  dodge_self.dodge_bgm.stop();
  dodge_self.socket.emit("enableButtonsafterScene")
  dodge_self.scene.stop("Dodgeball");
});
this.players.children.iterate(function (player) {
  player.setDepth(10);
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
    this.socket.emit('dodgeInput', { left: this.leftKeyPressed , right: this.rightKeyPressed, up: this.upKeyPressed });
  }
}

  displayPlayers(self, playerInfo, sprite) {
    console.log(`${playerInfo} displayed`)
    const player = self.add.sprite(playerInfo.x, playerInfo.y, sprite).setScale(0.2,0.2);
    addUsernameTeam(player,self,playerInfo,'#8A2BE2')
    player.playerId = playerInfo.playerId;
    self.players.add(player);
  }
}
