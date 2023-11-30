class Volleyball extends Phaser.Scene {

    constructor(){
        super("Volleyball");

    }

    init(data){
      this.socket = data.socket;
      this.io = data.io;
    }
  
  preload() {
    this.load.spritesheet("cat1", "assets/cats/Cat_1.png", {frameWidth:263, frameHeight:194});
    this.load.spritesheet("cat2", "assets/cats/Cat_2.png", {frameWidth:250, frameHeight:184});
    this.load.spritesheet("cat3", "assets/cats/Cat_3.png", {frameWidth:250, frameHeight:184});
    this.load.spritesheet("cat4", "assets/cats/Cat_4.png", {frameWidth:250, frameHeight:184});
    this.load.spritesheet("cat5", "assets/cats/Cat_5.png", {frameWidth:250, frameHeight:184});
    this.load.spritesheet("cat6", "assets/cats/Cat_6.png", {frameWidth:250, frameHeight:184});
    this.load.spritesheet("cat7", "assets/cats/Cat_7.png", {frameWidth:250, frameHeight:184});
    this.load.spritesheet("cat8", "assets/cats/Cat_8.png", {frameWidth:250, frameHeight:184});
    //load background
    this.load.image('sky', 'assets/volleyball/sky.png');
    this.load.image('net', 'assets/volleyball/platform2.png');
    this.load.image('volleyball', 'assets/volleyball/volleyball.png');
    this.load.image('volley_ground', 'assets/volleyball/platform.png');
  }
  
  create() {
    const self = this;
    this.players = this.add.group();
    this.balls = this.add.group();

    this.blueScore = 0;
    this.redScore = 0;
    console.log("Serverside Volleyball Running")

  //add players to this scene
  for(const playerId in players) {
    var randomX = Math.random() * self.game.config.width //set the cats at random y position and standard x position
    var yPos = self.game.config.height - 100
    players[playerId].y = yPos
    players[playerId].x = randomX
    addPlayer(this, players[playerId])
  }

  for (let [id, socket] of Object.entries(this.io.sockets.connected)) {
    socket.on('volleyInput', function (inputData) {
      handlePlayerInput(self, id, inputData);
    })
    socket.on('disconnect', function () {
      // remove player from server
      removePlayer(self,id);
      // remove this player from our players object
      delete players[id];
      console.log("Player Disconnected from Volleyball")

      // emit a message to all players to remove this player
      io.emit('disconnect_volleyball', id);
      });
  }

    //adding platforms to the game
    this.platforms = this.physics.add.staticGroup();
    this.ground = this.physics.add.staticGroup(); 

    this.ground.create(400, 568, 'volley_ground').setScale(2.3).refreshBody();
    this.ground.create(400, 600, 'volley_ground').setScale(2.3).refreshBody();

    this.platforms.create(400, 350, 'net').setScale(0.05, 6.4).refreshBody();
    
    //adding ball physics
    this.ball = this.physics.add.sprite(400, 200, 'volleyball');
    this.ball.setBounce(1);
    this.ball.setCollideWorldBounds(true);
    this.ball.setVelocityX(200);
    this.ball.setVelocityY(-150);
    this.balls.add(this.ball)
  
    //adding physics for balls and players
    this.physics.add.collider(this.players, this.ball, function (player, ball) {
      hitVolleyball(player, ball);
    });

     // Adding collision between ball and ground
     this.physics.add.collider(this.ball, this.ground, function (ball, ground) {
      // Check for scoring when the ball touches the ground
      if (ball.x < 400) {
        // Blue side scores
        self.blueScore++;
        // Reset the ball position given to blue
        ball.setPosition(400, 170);
        ball.setVelocityX(200);
        ball.setVelocityY(-150);
      } else {
        // Red side scores
        self.redScore++;
        // Reset the ball position given to red
        ball.setPosition(400, 170);
        ball.setVelocityX(-200);
        ball.setVelocityY(-150);
      }
      let b = self.blueScore
      let r = self.redScore
      io.emit('scoreUpdate', {blueScore:b, redScore:r });
    });
  
    //add more general colliders
    this.physics.add.collider(this.players, this.platforms);
    this.physics.add.collider(this.players, this.players);
    this.physics.add.collider(this.players, this.ground);
    this.physics.add.collider(this.ball, this.ground);
    this.physics.add.collider(this.ball, this.platforms);
    this.physics.add.collider(this.ball, this.players);



    // Initialize game as frozen
    this.gameFrozen = true;
    this.ball.setVelocity(0, 0);

    // Set a timed event to unfreeze the game after 10 seconds
    this.time.addEvent({
        delay: 10000,
        callback: () => {
            this.gameFrozen = false;
            // Restore ball physics
            this.ball.setVelocityX(200);
            this.ball.setVelocityY(-150);
        }   
    });
    // Set a timed event to add players to the game after 5 seconds
    this.time.addEvent({
      delay: 10000,
      callback: () => {
        this.io.emit("currentPlayers_volley", players)
      }
    });
  }
  
  update() {
  
    if (this.gameFrozen) {
      return;
  }

    const speed = 250
    //constantly emit each player's position/animation
    this.players.getChildren().forEach((player) => {

      //if player exists
      if(players[player.playerId]){
      const input = players[player.playerId].input;
      let animationKey = 'look_left';
      
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
    }
    });
    //emit player positions
    io.emit('playerUpdates_volley', players);
  
    var ball_x = this.ball.x;
    var ball_y = this.ball.y;
  
    //emit ball positions
    io.emit('ballUpdates', {ball_x,ball_y})

    if(getVolleyballWinner(this.blueScore, this.redScore) != null) {
      io.emit('gameOver', getVolleyballWinner(this.blueScore, this.redScore));
  
      let countdown = 5;
      const timerInterval = setInterval(() => {
        countdown--;
        if(countdown === 0) {
          clearInterval(timerInterval);
          io.emit('stopVolleyballScene');
          gameActive = false;
          this.scene.stop("Volleyball");
        }
      }, 300);
    }
  }
  }
  
  function hitVolleyball(player, ball) {  
    ball.setVelocityY(-500)
    if (ball.x < player.x) {
      ball.setVelocityX(-350);
    } else {
      ball.setVelocityX(350);
    }
  }

  function getVolleyballWinner(blueScore,redScore) {  
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