const players = {};

class MainScene extends Phaser.Scene {

    constructor(){
        super("MainScene");
    }

    preload(){
        //load cats
        this.load.spritesheet("cat1", "assets/cats/Cat_1.png", {frameWidth:263, frameHeight:194});
        this.load.image('ground', 'assets/volleyball/platform.png');
        this.load.image("P","assets/letters/P.png")
        this.load.image("O","assets/letters/O.png")
        this.load.image("R","assets/letters/R.png")
        this.load.image("Y","assets/letters/Y.png")
        this.load.image("A","assets/letters/A.png")
        this.load.image("T","assets/letters/T.png")

    }

    create(){

        const self = this;
        this.players = this.add.group();

        //platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 600, 'ground').setScale(2).refreshBody();
        this.platforms.create(100,450,'ground').setScale(0.3).refreshBody();
        this.platforms.create(500,300,'ground').setScale(0.3).refreshBody();
        this.platforms.create(600,200,'ground').setScale(0.3).refreshBody();
        this.platforms.create(300,350,'ground').setScale(0.3).refreshBody();
        this.physics.add.collider(this.platforms,this.players);

        //letters
        /** 
        var letterx = 100
        this.letters = this.physics.add.staticGroup();
        this.letters.create(50,letterx,"P").setScale(0.35).refreshBody();
        this.letters.create(120,letterx,"O").setScale(0.35).refreshBody();
        this.letters.create(190,letterx,"R").setScale(0.35).refreshBody();
        this.letters.create(250,letterx,"O").setScale(0.35).refreshBody();
        this.letters.create(310,letterx,"P").setScale(0.35).refreshBody();
        this.letters.create(370,letterx,"A").setScale(0.35).refreshBody();
        this.letters.create(460,letterx,"R").setScale(0.35).refreshBody();
        this.letters.create(550,letterx,"T").setScale(0.35).refreshBody();
        this.letters.create(700,letterx,"Y").setScale(0.35).refreshBody();
        this.physics.add.collider(this.letters,this.players);
        
        this.letters.children.iterate(function (letter) {
          letter.setBounce(0.5);
      });
      */
        //socket connection established
        io.on('connection', function (socket) {
            
          socket.on('stopMainSceneRequest', function (gameName){

            io.emit(gameName);
            
            if (gameName == "VolleyballGame"){
              this.scene.start("Volleyball")
            }
            if (gameName == "JumpGame"){
              //this.sene.start("Jump")
              console.log("jumpscene launched!")              
            }
            });


            socket.on('joinRoom', function (data){
              // create a new player and add it to our players object
            players[socket.id] = {
              x: Math.floor(Math.random() * 700) + 50,
              y: 500,
              playerId: socket.id,
              input: {
                  left: false,
                  right: false,
                  up: false
              },
              username:data.username,
              cat:data.cat,
              };
  
              // add player to server
              addPlayer(self, players[socket.id]);
  
              // send the players object to the new player
              socket.emit('currentPlayers', players);
  
              // update all other players of the new player
              socket.broadcast.emit('newPlayer', players[socket.id]);

              })
            


            //ask if username is valid
            socket.on('isKeyValid', (data)=>{
              //parse through player names set name_exists = true if username already exists
              var name_exists = false
              for (var playerId in players)
              {
                var player = players[playerId]
                //if player name is already available change value of name_exists
                if (data.username == player.username){
                  name_exists = true
                }
              }

              //only emit for non-existent usernames
              if(name_exists){
                socket.emit("KeyNotValid",data)
              }
              else{
                socket.emit("KeyisValid",data)
              }
            })


            socket.on('disconnect', function () {
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
        });

    }

    update(){
    const speed = 250
    //constantly emit each player's position
    this.players.getChildren().forEach((player) => {
        const input = players[player.playerId].input;

        if (input.left) {
        player.setVelocityX(-speed);
        } else if (input.right) {
        player.setVelocityX(speed);
        } else {
        player.setVelocityX(0);
        }
        if (input.up && player.body.touching.down) {
        player.setVelocityY(-330);
        } 
        players[player.playerId].x = player.x;
        players[player.playerId].y = player.y;

    });

    //emit player positions
    io.emit('playerUpdates', players);
        
    }
}



//create sprite for player
function addPlayer(self, playerInfo) {
  const player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'cat1');

  self.anims.create({
    key: 'left',
    frames: self.anims.generateFrameNumbers('cat1', { start: 0, end: 1 }),
    frameRate: 5,
    repeat: -1
  });

  self.anims.create({
    key: 'turn',
    frames: [{ key: 'cat1', frame: 2 }],
    frameRate: 20
  });

  self.anims.create({
    key: 'right',
    frames: self.anims.generateFrameNumbers('cat1', { start: 2, end: 3 }),
    frameRate: 5,
    repeat: -1
  });

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
