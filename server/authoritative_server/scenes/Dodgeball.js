class Dodgeball extends Phaser.Scene {

  constructor(){
      super("Dodgeball");
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
  this.load.image('sky', 'assets/dodgeball/spaceship.png');
  this.load.image('net', 'assets/dodgeball/platform2.png');
  this.load.image('earth', 'assets/dodgeball/earth.png');
  this.load.image('mars', 'assets/dodgeball/mars.png');
  this.load.image('saturn', 'assets/dodgeball/saturn.png');
  this.load.image('ground', 'assets/dodgeball/platform2.png');
}


create() {

  const self = this;
  this.players = this.add.group();
  this.balls = this.add.group();

  console.log("Serverside Dodgeball Running")

  // let hitCounter = 0;
  this.gameOver = false;

  //add players to this scene
  for(const playerId in players) {
    var randomX = Math.random() * self.game.config.width //set the cats at random y position and standard x position
    var yPos = self.game.config.height - 100
    players[playerId].y = yPos
    players[playerId].x = randomX
    addPlayer(this, players[playerId])
  }

  this.io.emit("currentPlayers_dodge", players)

  for (let [id, socket] of Object.entries(this.io.sockets.connected)) {
    console.log(id);
    socket.on('dodgeInput', function (inputData) {
      handlePlayerInput(self, id, inputData);
    })
  }

  //adding platforms to the game
  this.platforms = this.physics.add.staticGroup();
  this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  this.platforms.create(400, 350, 'net').setScale(0.05, 7).refreshBody();
  this.platforms.create(200, 220, 'ground').setScale(.5).refreshBody();
  this.platforms.create(600, 220, 'ground').setScale(.5).refreshBody();
  this.platforms.create(200, 400, 'ground').setScale(.5).refreshBody();
  this.platforms.create(600, 400, 'ground').setScale(.5).refreshBody();
  
  //adding ball physics
  this.ball = this.physics.add.sprite(400, 200, 'earth');
  this.ball.body.allowGravity = false;
  this.ball.setBounce(1);
  this.ball.setCollideWorldBounds(true);
  this.ball.setVelocityX(300);
  this.ball.setVelocityY(300);
  this.balls.add(this.ball)

  this.ball2 = this.physics.add.sprite(300, 200, 'mars');
  this.ball2.body.allowGravity = false;
  this.ball2.setBounce(1);
  this.ball2.setCollideWorldBounds(true);
  this.ball2.setVelocityX(300);
  this.ball2.setVelocityY(300);
  this.balls.add(this.ball2);

  this.ball3 = this.physics.add.sprite(400, 300, 'saturn');
  this.ball3.body.allowGravity = false;
  this.ball3.setBounce(1);
  this.ball3.setCollideWorldBounds(true);
  this.ball3.setVelocityX(300);
  this.ball3.setVelocityY(300);
  this.balls.add(this.ball3);

  //adding physics for balls and players
  this.physics.add.collider(this.players, this.ball, function (player, ball) {
    hitDodgeball(player, ball);
  });
  this.physics.add.collider(this.players, this.ball2, function (player, ball2) {
    hitDodgeball(player, ball2);
  });
  this.physics.add.collider(this.players, this.ball3, function (player, ball3) {
    hitDodgeball(player, ball3);
  });

  this.physics.add.collider(this.platforms, this.ball)
  this.physics.add.collider(this.platforms, this.ball2)
  this.physics.add.collider(this.platforms, this.ball3)
  this.physics.add.collider(this.players, this.platforms)
  this.physics.add.collider(this.ball2, this.ball)
  this.physics.add.collider(this.ball3, this.ball)
  this.physics.add.collider(this.ball3, this.ball2)

  // 10 seconds before player can be killed
  let countdown = 10;
  const timerInterval = setInterval(() => {
    countdown--;
    if(countdown === 0) {
      clearInterval(timerInterval);
      for (let [id, socket] of Object.entries(this.io.sockets.connected)) {
        players[id].invuln = false;
      } 
    }
  }, 1000);

}

update() {
  const speed = 250
  //constantly emit each player's position/animation
  this.players.getChildren().forEach((player) => {
    
    try {
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
    catch(TypeError) {
      console.log("dodgeball not started");
    }

  });
  //emit player positions
  io.emit('playerUpdates_dodge', players);

  var ball_x = this.ball.x;
  var ball_y = this.ball.y;
  var ball2_x = this.ball2.x;
  var ball2_y = this.ball2.y;
  var ball3_x = this.ball3.x;
  var ball3_y = this.ball3.y;

  //emit ball positions
  io.emit('ballUpdates', {ball_x,ball_y})
  io.emit('ballUpdates2', {ball2_x,ball2_y})
  io.emit('ballUpdates3', {ball3_x,ball3_y})


  if(!(getWinnerName() === null)) {
    io.emit('gameOver', getWinnerName());

    let countdown = 5;
    const timerInterval = setInterval(() => {
      countdown--;
      if(countdown === 0) {
        clearInterval(timerInterval);
        io.emit('stopDodgeballScene');
        this.scene.stop("Dodgeball");
      }
    }, 300);
  }

}


}
//pass data into player function
function handlePlayerInput(self, playerId, input) {
  self.players.getChildren().forEach((player) => {
    if (playerId === player.playerId) {
      players[player.playerId].input = input;    }   
  });
}

//create sprite for player
function addPlayer(self, playerInfo) {
  const player = self.physics.add.sprite(playerInfo.x, playerInfo.y, playerInfo.cat);
  // Set initial animation state
  player.playerId = playerInfo.playerId;
  self.players.add(player);
  player.setBounce(0.2);
  player.setScale(0.12, 0.12);  
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

function hitDodgeball(player, ball) {

  // Checks if player is in loading screen
  // If they are then ball will bounce off
  // Otherwise death
  if(players[player.playerId].invuln) {
    if (ball.x < player.x) {
      ball.setVelocityX(-300);
    } else {
      ball.setVelocityX(300);
    }
  }
  else {
    player.x = 2000;
    player.y = 2000;
    player.setVisible(false);
    players[player.playerId].alive = "dead";

    if (ball.x < player.x) {
      ball.setVelocityX(-300);
    } else {
      ball.setVelocityX(300);
    }
  }
  
}

function getWinnerName() {
  let left = 0;
  sockets = Object.keys(players);

  if(!(players === null)) {
    for (let i = 0; i < sockets.length; i++) {
      if(players[sockets[i]].alive == 'alive') {
          left++;
          winner = players[sockets[i]].username;
      };
    }
  }

  if(left === 1) {
    return winner;
  }
  return null;
}