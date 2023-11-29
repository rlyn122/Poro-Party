class Soccer extends Phaser.Scene {

  constructor(){
      super("Soccer");
  }

  init(data){
    this.socket = data.socket;
  }

  preload() {
    //load sprites
    this.load.spritesheet('cat1', 'assets/cats/Cat_1.png', { frameWidth: 263, frameHeight: 192 });  
    this.load.spritesheet('cat2', 'assets/cats/Cat_2.png', { frameWidth: 250, frameHeight: 184 });  
    this.load.spritesheet('cat3', 'assets/cats/Cat_3.png', { frameWidth: 250, frameHeight: 184 });  
    this.load.spritesheet('cat4', 'assets/cats/Cat_4.png', { frameWidth: 250, frameHeight: 184 });  
    this.load.spritesheet('cat5', 'assets/cats/Cat_5.png', { frameWidth: 250, frameHeight: 184 });  
    this.load.spritesheet('cat6', 'assets/cats/Cat_6.png', { frameWidth: 250, frameHeight: 184 });  
    this.load.spritesheet('cat7', 'assets/cats/Cat_7.png', { frameWidth: 250, frameHeight: 184 });  
    this.load.spritesheet('cat8', 'assets/cats/Cat_8.png', { frameWidth: 250, frameHeight: 184 });  


    //load background
    this.load.image('sky', 'assets/soccer/field.png');
    this.load.image('ball', 'assets/soccer/soccerball.png');
    this.load.image('ground', 'assets/soccer/grass.png');
    this.load.image('blue_goal', 'assets/soccer/blue_goal.png');
    this.load.image('red_goal', 'assets/soccer/red_goal.png');

  }

  create() {
    var self = this;
    this.players = this.add.group();

    console.log("Client-side Soccer Running")
    this.scene.launch("Rules_Soccer");

    //add background

    this.add.image(400, 300, 'sky');
    this.add.image(400, 568, 'ground').setScale(2);
    this.add.image(400, 600, 'ground').setScale(2).setTint(0);
    this.add.image(50, 415, 'red_goal').setScale(.1);
    this.add.image(750, 415, 'blue_goal').setScale(-0.1, .1);

    // create the first ball
    var ball = this.add.sprite(400, 200, 'ball').setScale(2);

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
    this.socket.on('currentPlayers_soccer', function (players) {
      Object.keys(players).forEach(function (id) {

        //if it is this client
        if (players[id].playerId === self.socket.id) {
          displayPlayers(self, players[id], players[id].cat);
        }
        //if it is another client
        else{
          displayPlayers(self,players[id], players[id].cat)
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
    this.socket.on('playerUpdates_soccer', function (players) {
      Object.keys(players).forEach(function (id) {
        self.players.getChildren().forEach(function (player) {
          if (players[id].playerId === player.playerId) {
            player.setPosition(players[id].x, players[id].y);
            setUsername_Pos(player,players[id].x, players[id].y);
          }
        });
      });
    });

    //update ball positions
    this.socket.on('soccer_ballUpdates', function(ball_Pos) {
      const {ball_x, ball_y} = ball_Pos;
      ball.setPosition(ball_x,ball_y)
    })

    //score updates
    this.socket.on('scoreUpdate', function (scores) {
      try{
      self.blueScoreText.setText(`Blue: ${scores.blueScore}`);
      self.redScoreText.setText(`Red: ${scores.redScore}`);
      } catch(error){}
    });

    //create cursors
    this.cursors = this.input.keyboard.createCursorKeys();
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
    this.upKeyPressed = false;
    
    const soc_gameOverText = this.add.text(250, 150, "", {
      fill: "#000000",
      fontFamily: 'Arial',
      fontSize: "50px"
    });
  
    this.socket.on('gameOver', function(team) {
      soc_gameOverText.setText(team + " Won")
      self.socket.emit('')
    });
  
    this.socket.on('stopSoccerScene', () => {
      self.scene.stop("Soccer");
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
      this.socket.emit('soccerInput', { left: this.leftKeyPressed , right: this.rightKeyPressed, up: this.upKeyPressed });
    }
  }
}
