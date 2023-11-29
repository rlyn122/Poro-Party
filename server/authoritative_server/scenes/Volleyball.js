let blueScore = 0;
let redScore = 0;

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
    this.load.image('ground', 'assets/volleyball/platform.png');
  }
  
  create() {
    const self = this;
    this.players = this.add.group();
    this.balls = this.add.group();

    console.log("Serverside Volleyball Running")

  //add players to this scene
  for(const playerId in players) {
    var randomX = Math.random() * self.game.config.width //set the cats at random y position and standard x position
    var yPos = self.game.config.height - 100
    players[playerId].y = yPos
    players[playerId].x = randomX
    addPlayer(this, players[playerId])
  }

  this.io.emit("currentPlayers_volley", players)

  for (let [id, socket] of Object.entries(this.io.sockets.connected)) {
    console.log(id);
    socket.on('volleyInput', function (inputData) {
      handlePlayerInput(self, id, inputData);
    })
  }

    //add score counters
    let countdownCompleted = false;
    this.blueScore = blueScore
    this.redScore = redScore
    this.gameOver = false;
  
    //adding platforms to the game
    this.platforms = this.physics.add.staticGroup();
    this.ground = this.physics.add.staticGroup(); 

    this.ground.create(400, 568, 'ground').setScale(2.3).refreshBody();
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
        blueScore++;
        // Reset the ball position given to blue
        ball.setPosition(400, 170);
        ball.setVelocityX(200);
        ball.setVelocityY(-150);
      } else {
        // Red side scores
        redScore++;
        // Reset the ball position given to red
        ball.setPosition(400, 170);
        ball.setVelocityX(-200);
        ball.setVelocityY(-150);
      }
      io.emit('scoreUpdate', { blueScore, redScore });
    });
  
    //add more general colliders
    this.physics.add.collider(this.players, this.platforms);
    this.physics.add.collider(this.players, this.players);
    this.physics.add.collider(this.players, this.ground);
    this.physics.add.collider(this.ball, this.ground);
    this.physics.add.collider(this.ball, this.platforms);
    this.physics.add.collider(this.ball, this.players);
  }
  
  update() {
  
    const speed = 250
    //constantly emit each player's position/animation
    this.players.getChildren().forEach((player) => {
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
  
    });
    //emit player positions
    io.emit('playerUpdates_volley', players);
  
    var ball_x = this.ball.x;
    var ball_y = this.ball.y;
  
    //emit ball positions
    io.emit('ballUpdates', {ball_x,ball_y})


    if(getVolleyballWinner() != null) {
      io.emit('gameOver', getVolleyballWinner());
  
      let countdown = 5;
      const timerInterval = setInterval(() => {
        countdown--;
        if(countdown === 0) {
          clearInterval(timerInterval);
          io.emit('stopVolleyballScene');
          this.scene.stop("Volleyball");
        }
      }, 300);
    }
  }
  }
  
  //pass data into player function
  function handlePlayerInput(self, playerId, input, animationKey) {
    self.players.getChildren().forEach((player) => {
      if (playerId === player.playerId) {
        players[player.playerId].input = input;
        players[player.playerId].animationKey = animationKey;
      }
    });
  }
  
  //create sprite for player
  function addPlayer(self, playerInfo) {
    const player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'cat1');
  
    // Set initial animation state
    player.playerId = playerInfo.playerId;
    self.players.add(player);
    player.setBounce(0.2);
    player.setScale(0.2, 0.2);  
    player.setCollideWorldBounds(true);
  
  }
  
  //delete sprite for player
  function removePlayer(self, playerId) {
    self.players.getChildren().forEach((player) => {
      if (playerId === player.playerId) {
        player.destroy();
      }
    });
  }
  
  function hitVolleyball(player, ball) {  
    ball.setVelocityY(-500)
    if (ball.x < player.x) {
      ball.setVelocityX(-350);
    } else {
      ball.setVelocityX(350);
    }
  }

  function getVolleyballWinner() {  
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