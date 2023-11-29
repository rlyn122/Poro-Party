class MainScene extends Phaser.Scene {

    constructor(){
        super("MainScene");
        this.playerCount = 0;
    }



    preload(){
        //load cats
        this.load.spritesheet("cat1", "assets/cats/Cat_1.png", {frameWidth:263, frameHeight:194});
        this.load.spritesheet("cat2", "assets/cats/Cat_2.png", {frameWidth:250, frameHeight:184});
        this.load.spritesheet("cat3", "assets/cats/Cat_3.png", {frameWidth:250, frameHeight:184});
        this.load.spritesheet("cat4", "assets/cats/Cat_4.png", {frameWidth:250, frameHeight:184});
        this.load.spritesheet("cat5", "assets/cats/Cat_5.png", {frameWidth:250, frameHeight:184});
        this.load.spritesheet("cat6", "assets/cats/Cat_6.png", {frameWidth:250, frameHeight:184});
        this.load.spritesheet("cat7", "assets/cats/Cat_7.png", {frameWidth:250, frameHeight:184});
        this.load.spritesheet("cat8", "assets/cats/Cat_8.png", {frameWidth:250, frameHeight:184});

        //load background
        this.load.image("bg","assets/lobby.jpg");
        this.load.image('lobbyground', 'assets/dodgeball/lobbyground.png');
    }

    create() {
        var self = this;
        this.socket = io();

        this.scene.launch("Login", {socket:this.socket});

        this.letters = this.add.group();
        this.players = this.add.group();


        //add background
        this.add.image(0,0,"bg").setOrigin(0);
        this.add.image(400, 600, 'lobbyground').setScale(2).setTint(0); 
        this.add.image(100,450,'lobbyground').setScale(0.3);
        this.add.image(500,300,'lobbyground').setScale(0.3);
        this.add.image(600,200,'lobbyground').setScale(0.3);
        this.add.image(300,350,'lobbyground').setScale(0.3);      

        //listen for currentPlayers and self
        this.socket.on('currentPlayers', function (players) {
          Object.keys(players).forEach(function (id) {
          displayPlayers(self, players[id], players[id].cat);

            //set initial playerCount
            self.playerCount = (Object.keys(players).length)
            self.playerCountText = self.add.text(50, 20, `Lobby: ${(Object.keys(players).length)} players`, {
                fill: "#7CFC00",
                fontSize: "20px",
                fontStyle: "bold",
              });

            //create scene transition buttons
            self.startDodgeballGameButton = self.add.text(500,20,"Start Dodgeball Game",{
              fill: "#FFFFFF",
              fontSize: "20px",
              fontStyle: "bold",
            });
            
            self.startVolleyGameButton = self.add.text(500,60,"Start Volleyball Game",{
              fill: "#FFFFFF",
              fontSize: "20px",
              fontStyle: "bold",
            });

            self.startSoccerGameButton = self.add.text(500,100,"Start Soccer Game",{
              fill: "#FFFFFF",
              fontSize: "20px",
              fontStyle: "bold",
            });

            //asking server to launch dodgeball scene
            self.startDodgeballGameButton.setInteractive();
            self.startDodgeballGameButton.on("pointerdown", () => {
              self.socket.emit("stopMainSceneRequest","DodgeballGame");
            });

            //asking server to launch volleyball scene
            self.startVolleyGameButton.setInteractive();
            self.startVolleyGameButton.on("pointerdown", () => {
              self.socket.emit("stopMainSceneRequest","VolleyballGame");
            });

            //asking server to launch volleyball scene
            self.startSoccerGameButton.setInteractive();
            self.startSoccerGameButton.on("pointerdown", () => {
              self.socket.emit("stopMainSceneRequest","SoccerGame");
            });
          });
        });
        
        //receive signals to launch games from server
        this.socket.on("DodgeballGame", ()=>{
          this.scene.launch("Dodgeball",{socket:self.socket})
        })

        //launch volleyball game from here
        this.socket.on("VolleyballGame", ()=>{
          this.scene.launch("Volleyball",{socket:self.socket})
        })

        //launch soccer game from here
        this.socket.on("SoccerGame", ()=>{
          this.scene.launch("Soccer",{socket:self.socket})
        })
  
        //listen for newPlayer connection
        this.socket.on('newPlayer', function (playerInfo) {
          displayPlayers(self, playerInfo, playerInfo.cat);
          if(self.playerCountText){
          self.playerCount += 1;
          self.playerCountText.setText(`Lobby: ${self.playerCount} players`);
          }
        });
      
        //listen for player disconnection
        this.socket.on('disconnect', function (playerId) {
          self.players.getChildren().forEach(function (player) {
            if (playerId === player.playerId) {
              player.usernameText.destroy();
              player.destroy();
              self.playerCount -= 1;
              self.playerCountText.setText(`Lobby: ${self.playerCount} players`);
            }
          });
        });
      
        //update player movements from server
        this.socket.on('playerUpdates', function (players) {
          Object.keys(players).forEach(function (id) {
            self.players.getChildren().forEach(function (player) {
              if (players[id].playerId === player.playerId) {
                player.setPosition(players[id].x, players[id].y);
                setUsername_Pos(player,players[id].x, players[id].y);
              }
            });
          });
        });
      
      
      
        //create cursors
        this.cursors = this.input.keyboard.createCursorKeys();
        this.leftKeyPressed = false;
        this.rightKeyPressed = false;
        this.upKeyPressed = false;
      }
      
       update() {
      
        const left = this.leftKeyPressed;
        const right = this.rightKeyPressed;
        const up = this.upKeyPressed;
      
        //handle cursor inputs
        if (this.cursors.left.isDown) {
          this.leftKeyPressed = true;
          this.rightKeyPressed = false;
          this.upKeyPressed = false;
        } else if (this.cursors.right.isDown) {
          this.rightKeyPressed = true;
          this.leftKeyPressed = false;
          this.upKeyPressed = false;
        } else {
          this.leftKeyPressed = false;
          this.rightKeyPressed = false;
          this.upKeyPressed = false;
        }
        if (this.cursors.up.isDown) {
          this.upKeyPressed = true;
        } 
        //if the state of a key has been changed, emit the state of keys to server
        if ( left !== this.leftKeyPressed || right !== this.rightKeyPressed || up !== this.upKeyPressed) {
          this.socket.emit('playerInput', { left: this.leftKeyPressed , right: this.rightKeyPressed, up: this.upKeyPressed });
        }
      }
      
      }

//display players
function displayPlayers(self, playerInfo, sprite) {
  const player = self.add.sprite(playerInfo.x, playerInfo.y, sprite).setScale(0.2,0.2);
  addUsername(player,self,playerInfo)
  player.playerId = playerInfo.playerId;
  self.players.add(player);
  console.log(self.players)
}

//function to add player username onto screen
function addUsername(player, scene, playerInfo){
  player.usernameText = scene.add.text(0,0,playerInfo.username, { font: '16px Arial', fill: '#ff70a7' });
  this.setUsername_Pos(player,playerInfo.x,playerInfo.y)
}

function setUsername_Pos(player, posX, posY){
  player.usernameText.x = posX-15;
  player.usernameText.y = posY - player.height / 4;
}
