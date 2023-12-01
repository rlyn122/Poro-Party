class Soccer extends Phaser.Scene {

  constructor(){
      super("Soccer");
  }

  init(data){
    this.socket = data.socket;
    this.io = data.io;
  }

  preload() {

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
    this.load.image('net', 'assets/soccer/grass.png');
    this.load.image('ball', 'assets/soccer/soccerball.png');
    this.load.image('soccer_ground', 'assets/soccer/grass.png');
  }

  create() {

    console.log("Server-side Soccer Game Running")
    
    const self = this;
    this.players = this.add.group();
    this.balls = this.add.group();
    this.blueScore = 0;
    this.redScore = 0;

    var currentPlayers = players

    //add players to this scene
    for (const playerId in players){
      var randomX = Math.random() * self.game.config.width //set the cats at random y position and standard x position
      var yPos = self.game.config.height - 100
      players[playerId].y = yPos
      players[playerId].x = randomX
      addPlayer(this, players[playerId])
    }

    //handle player inputs and change player object
    for (let [id, socket] of Object.entries(this.io.sockets.connected)) {
      socket.on('soccerInput', function (inputData) {
        handlePlayerInput(self, id, inputData);
        })
      socket.on('disconnect', function () {
        // remove player from server
        removePlayer(self, id);
        // remove this player from our players object
        delete players[id];
        // emit a message to all players to remove this player
        io.emit('disconnect_soccer', id);
        });
  }
    
    this.gameOver = false;

    this.platforms = this.physics.add.staticGroup();
    this.net = this.physics.add.staticGroup();
    //ground
    this.platforms.create(400, 568, 'soccer_ground').setScale(2).refreshBody();
    this.platforms.create(400, 600, 'soccer_ground').setScale(2).refreshBody().setTint(0);

    //sprite backbone
    //left sprite
    this.net.create(20, 460, 'net').setScale(0.02, 5).refreshBody();
    this.net.create(30, 380, 'net').setScale(0.02, 0.5).refreshBody();
    this.net.create(40, 360, 'net').setScale(0.02, 0.5).refreshBody();
    this.net.create(50, 350, 'net').setScale(0.02, 0.5).refreshBody();
    this.net.create(60, 330, 'net').setScale(0.02, 0.5).refreshBody();
    this.net.create(70, 315, 'net').setScale(0.02, 0.5).refreshBody();

    this.platforms.create(30, 360, 'net').setScale(0.02, 0.5).refreshBody();
    this.platforms.create(40, 340, 'net').setScale(0.02, 0.5).refreshBody();
    this.platforms.create(50, 330, 'net').setScale(0.02, 0.5).refreshBody();
    this.platforms.create(60, 310, 'net').setScale(0.02, 0.5).refreshBody();
    this.platforms.create(70, 295, 'net').setScale(0.02, 0.5).refreshBody();
    this.platforms.create(80, 280, 'net').setScale(0.02, 1).refreshBody();

    //right sprite
    this.net.create(780, 460, 'net').setScale(0.02, 5).refreshBody();
    this.net.create(770, 380, 'net').setScale(0.02, 0.5).refreshBody();
    this.net.create(760, 360, 'net').setScale(0.02, 0.5).refreshBody();
    this.net.create(750, 350, 'net').setScale(0.02, 0.5).refreshBody();
    this.net.create(740, 330, 'net').setScale(0.02, 0.5).refreshBody();
    this.net.create(730, 315, 'net').setScale(0.02, 0.5).refreshBody();

    this.platforms.create(770, 360, 'net').setScale(0.02, 0.5).refreshBody();
    this.platforms.create(760, 340, 'net').setScale(0.02, 0.5).refreshBody();
    this.platforms.create(750, 330, 'net').setScale(0.02, 0.5).refreshBody();
    this.platforms.create(740, 310, 'net').setScale(0.02, 0.5).refreshBody();
    this.platforms.create(730, 295, 'net').setScale(0.02, 0.5).refreshBody();
    this.platforms.create(720, 280, 'net').setScale(0.02, 1).refreshBody();
    
    this.ball = this.physics.add.sprite(400, 200, 'ball');
    this.ball.setBounce(1);
    this.ball.setCollideWorldBounds(true);
    this.ball.setVelocityY(300);
    this.balls.add(this.ball);
    this.ball.setScale(2);

    this.physics.add.collider(this.players, this.ball);

    this.physics.add.collider(this.ball, this.net, function (ball, net) {
      // Check for scoring when the ball touches the ground
      if (ball.x < 90 && ball.x > 10) {
        // Blue side scores
        self.blueScore++;
      } else if (ball.x > 710 && ball.x < 790) {
        // Red side scores
        self.redScore++;
      }
      // Emit score updates to all players
      let b = self.blueScore;
      let r = self.redScore;
      io.emit('scoreUpdate', { blueScore:b, redScore:r });

      // Reset the ball position
      ball.setPosition(400, 200);
      ball.setVelocityX(0);
      ball.setVelocityY(300);
    });

    //add colliders
    this.physics.add.collider(this.players, this.platforms);
    this.physics.add.collider(this.players, this.players);
    this.physics.add.collider(this.ball, this.platforms);
    this.physics.add.collider(this.ball, this.players);
    this.physics.add.collider(this.net, this.ball);
    this.physics.add.collider(this.net, this.players);


    // Initialize game as frozen
    this.gameFrozen = true;
    this.ball.setVelocity(0, 0);

    // Set a timed event to unfreeze the game after 10 seconds
    this.time.addEvent({
        delay: 10000,
        callback: () => {
            this.gameFrozen = false;
            // Restore ball physics
            this.ball.setVelocityX(0);
            this.ball.setVelocityY(-150);
        }
    });

    // Set a timed event to add players to the game after 5 seconds
    this.time.addEvent({
      delay: 10000,
      callback: () => {
        this.io.emit("currentPlayers_soccer", currentPlayers)
      }
    });
  }

  update() {

    if (this.gameFrozen) {
      return;
  }

    const speed = 250
    //constantly emit each player's position
    this.players.getChildren().forEach((player) => {
      const input = players[player.playerId].input;
      var animationKey = 'look_left';

      if (input.left) {
        player.setVelocityX(-speed);
        animationKey = 'left'
      } else if (input.right) {
        player.setVelocityX(speed);
        animationKey = 'right'
      } else {
        player.setVelocityX(0);
        if (animationKey == 'right') {
          animationKey = 'look_right'
        }
      }
      if (input.up && player.body.touching.down) {
        player.setVelocityY(-400);
      }

      players[player.playerId].x = player.x;
      players[player.playerId].y = player.y;

      handlePlayerInput(this, player.playerId, input, animationKey); // Pass animation key
    });
    //emit player positions
    io.emit('playerUpdates_soccer', players);

    var ball_x = this.ball.x;
    var ball_y = this.ball.y;

    //emit ball positions
    io.emit('soccer_ballUpdates', {ball_x,ball_y})

    if(getSoccerWinner(this.blueScore,this.redScore) != null) {
      io.emit('gameOver', getSoccerWinner(this.blueScore,this.redScore));
  
      let countdown = 5;
      const timerInterval = setInterval(() => {
        countdown--;
        if(countdown === 0) {
          clearInterval(timerInterval);
          io.emit('stopSoccerScene');
          gameActive = false;
          this.scene.stop("Soccer");
        }
      }, 300);
    }

  }
}
function getSoccerWinner(blueScore, redScore) {  
  if (blueScore == 5) {
    return "Blue"
  }
  else if (redScore == 5) {
    return "Red";
  }
  else{
    return null;
  }
}
