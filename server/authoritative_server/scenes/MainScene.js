const players = {};
var gameActive = false;

class MainScene extends Phaser.Scene {

  constructor(){
      super("MainScene");
  }

  preload(){
      //load cats
      this.load.spritesheet("cat1", "assets/cats/Cat_1.png", {frameWidth:263, frameHeight:194});
      this.load.image('ground', 'assets/volleyball/platform.png');
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
      this.physics.add.collider(this.players,this.players);


      //add players to this scene
      for (const playerId in players){
        players[playerId].alive = "alive"
        addPlayer(this , players[playerId])
      }

      //socket connection established
      io.on('connection', function (socket) {

        //handle enabling buttons when scene ends
        socket.on('enableButtonsafterScene',()=>{
          io.emit('enableButtons')
        })

        //handles requests to start game
        socket.on('stopMainSceneRequest', function (gameName){
          
          //check if another scene is active
          if(self.isAnyOtherSceneActive()){
            console.log("Other scene is active, do not start other games")
          }
          else{
          //disable start buttons
          io.emit("disableButtons")
          gameActive = true;

          //let clients know to start game
          io.emit(gameName);

          //launch game on the serverside
          if (gameName == "DodgeballGame"){
            self.scene.launch("Dodgeball",{socket:socket, io:io})
          }
          if (gameName == "VolleyballGame"){
            console.log("Volleyball Game Launched!")
            self.scene.launch("Volleyball",{socket:socket, io:io})
          }

          if (gameName == "SoccerGame"){
            console.log("Soccer Game Launched!")
            self.scene.launch("Soccer",{socket:socket, io:io})
          }

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
            invuln:true,
            alive:"alive",
            };

            // add player to server
            addPlayer(self, players[socket.id]);

            // send the players object to the new player
            socket.emit('currentPlayers', players);

            //establish whether or not buttons should be enabled
            if(gameActive){
              io.emit('disableButtons')
            }
            else{
              io.emit('enableButtons')
            }

            // update all other players of the new player
            socket.broadcast.emit('newPlayer', players[socket.id]);
            // when a player moves, update the player data
            socket.on('playerInput', function (inputData) {
              handlePlayerInput(self, socket.id, inputData);
              });
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
          console.log("Player Disconnected from Mainscene")
          // remove player from server
          removePlayer(self, socket.id);
          // remove this player from our players object
          delete players[socket.id];
          // emit a message to all players to remove this player
          io.emit('disconnect_mainScene', socket.id);
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


  // Function to check if any scene other than 'MainScene' is active
  isAnyOtherSceneActive() {
    const allScenes = this.scene.manager.getScenes();

    for (let scene of allScenes) {
        if (scene.scene.key !== 'MainScene' && this.scene.isActive()) {
            return true;
        }
    }
    return false;
}

}



//create sprite for player
function addPlayer(self, playerInfo) {
  const player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'cat1');
  player.playerId = playerInfo.playerId;
  self.players.add(player);
  player.setBounce(0.0);
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
