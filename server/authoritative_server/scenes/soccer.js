const players = {};

const config = {
  type: Phaser.HEADLESS,
  parent: 'game',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 400 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  autoFocus: false
};

function preload() {

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
}

function create() {
  const self = this;
  this.players = this.add.group();
  this.balls = this.add.group();
  
  //add score counters
  let blueScore = 0;
  let redScore = 0;
  this.blueScore = blueScore
  this.redScore = redScore

  this.gameOver = false;

  this.platforms = this.physics.add.staticGroup();
  this.net = this.physics.add.staticGroup();
  //ground
  this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  
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



  //this.ground.create(10, 380, 'net').setScale(0.02, 1).refreshBody();

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


  // this.net.create(780, 460, 'net').setScale(0.02, 5).refreshBody();
  // this.net.create(790, 380, 'net').setScale(0.02, 1).refreshBody();
  // this.net.create(775, 350, 'net').setScale(0.02, 1).refreshBody();
  // this.net.create(760, 330, 'net').setScale(0.02, 1).refreshBody();
  // this.net.create(750, 315, 'net').setScale(0.02, 1).refreshBody();
  // this.net.create(740, 300, 'net').setScale(0.02, 1).refreshBody();

  
  this.ball = this.physics.add.sprite(400, 200, 'mars');
  this.ball.body.allowGravity = false;
  this.ball.setBounce(1);
  this.ball.setCollideWorldBounds(true);
  this.ball.setVelocityY(300);
  this.balls.add(this.ball);
  this.ball.setScale(2);


  this.physics.add.collider(this.players, this.ball);

  this.physics.add.collider(this.ball, this.net, function (ball, net) {
    // Check for scoring when the ball touches the ground
    if (ball.x < 80 && ball.x > 20) {
      // Blue side scores
      blueScore++;

    } else if (ball.x > 720 && ball.x < 780) {
      // Red side scores
      redScore++;
    }
    // Emit score updates to all players
    io.emit('scoreUpdate', { blueScore, redScore });

    // Reset the ball position
    ball.setPosition(400, 200);
    ball.setVelocityX(0);
    ball.setVelocityY(300);
  });

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 1 }),
    frameRate: 10,
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
    frameRate: 10,
    repeat: -1
  });

  //socket connection established
  io.on('connection', function (socket) {
    console.log('a user connected');
    
    // create a new player and add it to our players object
    players[socket.id] = {
      x: Math.floor(Math.random() * 700) + 50,
      y: 500,
      playerId: socket.id,
      input: {
        left: false,
        right: false,
        up: false
      }
    };
    
    // add player to server
    addPlayer(self, players[socket.id]);

    // send the players object to the new player
    socket.emit('currentPlayers', players);

    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);


    socket.on('disconnect', function () {
      console.log('user disconnected');
      // remove player from server
      removePlayer(self, socket.id);
      // remove this player from our players object
      delete players[socket.id];
      // emit a message to all players to remove this player
      io.emit('disconnect', socket.id);
    });

    // when a player moves, update the player data
    socket.on('playerInput', function (inputData) {
      handlePlayerInput(self, socket.id, inputData);
    });

    // Emit initial scores
    socket.emit('scoreUpdate', { blueScore, redScore });
  });

  //add colliders
  this.physics.add.collider(this.players, this.platforms);
  this.physics.add.collider(this.players, this.players);
  this.physics.add.collider(this.ball, this.platforms);
  this.physics.add.collider(this.ball, this.players);
  this.physics.add.collider(this.net, this.ball);
  this.physics.add.collider(this.net, this.players);

}

function update() {

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
  io.emit('playerUpdates', players);

  var ball_x = this.ball.x;
  var ball_y = this.ball.y;

  //emit ball positions
  io.emit('ballUpdates', {ball_x,ball_y})

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
  const player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'cat');

  // Set initial animation state
  player.playerId = playerInfo.playerId;
  self.players.add(player);
  player.setBounce(0.2);
  player.setScale(0.15, 0.15);  
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




const game = new Phaser.Game(config);
window.gameLoaded();
