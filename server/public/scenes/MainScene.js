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

            // Creating buttons
            self.startDodgeballGameButton = createButton(self, 500, 20, "Start Dodgeball Game", 'DodgeballGame',self.socket);
            self.startVolleyGameButton = createButton(self, 500, 60, "Start Volleyball Game", 'VolleyballGame',self.socket);
            self.startSoccerGameButton = createButton(self, 500, 100, "Start Soccer Game", 'SoccerGame',self.socket);


            // Create the 'Game in Progress' sign
            self.gameInProgressSign = self.add.text(450, 20, "Game in progress, \nplease wait \n buttons will refresh \n when game is over", {
              fill: "#FF0000",
              fontSize: "20px",
              fontStyle: "bold",
              backgroundColor: "#000000",
              padding: 20,
              align: 'center',
              fixedWidth: 280,
              fixedHeight: 125,
              border: "5px solid red",
          }).setVisible(false); // Initially hidden
            //disable game buttons while gameactive 
            self.socket.on('disableButtons',()=>{
              disableButtons(self)
            });

            self.socket.on('enableButtons',()=>{
              enableButtons(self)
            });
          });
        })
        
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
        this.socket.on('disconnect_mainScene', function (playerId) {
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
  if(playerInfo&&sprite){
  const player = self.add.sprite(playerInfo.x, playerInfo.y, sprite).setScale(0.2,0.2);
  if (player) {
    addUsername(player,self,playerInfo)
    //high depth value to bring the player sprite to the front
    player.setDepth(100);
    player.playerId = playerInfo.playerId;
    self.players.add(player);
  } else {
    console.error('Failed to create player sprite');
  }
  }
}

//function to add player username onto screen
function addUsername(player, scene, playerInfo){
  player.usernameText = scene.add.text(0,0,playerInfo.username, { 
    font: '20px Press Start 2P', 
    fill: '#ffffff',
    stroke: '#000000', // Black stroke
    strokeThickness: 2,
    shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 1, fill: true }
  });
  this.setUsername_Pos(player,playerInfo.x,playerInfo.y)
}

function addUsernameTeam(player, scene, playerInfo, teamColor){
  player.usernameText = scene.add.text(0,0,playerInfo.username, { 
    font: '20px Press Start 2P', 
    fill: teamColor,
    stroke: '#000000', // Black stroke
    strokeThickness: 2,
    shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 1, fill: true }
  });
  this.setUsername_Pos(player,playerInfo.x,playerInfo.y)
}

function setUsername_Pos(player, posX, posY) {
  // Calculate the scaled dimensions of the sprite
  const scaledSpriteWidth = player.width * player.scaleX;
  const scaledSpriteHeight = player.height * player.scaleY;

  // Calculate the center position of the scaled sprite
  const spriteCenterX = posX + scaledSpriteWidth / 2;

  // Get the width of the username text
  const textWidth = player.usernameText.width;

  // Center the text over the scaled sprite
  player.usernameText.x = spriteCenterX - textWidth / 2- 25;

  // Position the text above the scaled sprite
  // Adjust this offset depending on the size of your scaled sprite and desired position
  player.usernameText.y = posY - scaledSpriteHeight / 4 -35;
}

function disableButtons(self) {
  // Disable the buttons
  console.log("buttons disabled")
  self.gameInProgressSign.setVisible(true).setDepth(2);
  self.startDodgeballGameButton.removeInteractive();
  self.startVolleyGameButton.removeInteractive();
  self.startSoccerGameButton.removeInteractive();
}

function enableButtons(self) {
  // Enable the buttons
  console.log("buttons enabled")

  self.gameInProgressSign.setVisible(false);
  self.startDodgeballGameButton.setInteractive();
  self.startVolleyGameButton.setInteractive();
  self.startSoccerGameButton.setInteractive();
}

// Function to create a button
function createButton(scene, x, y, text, gameName,socket) {
  // Create the text element
  let buttonText = scene.add.text(x, y, text, {
      fill: "#FFFFFF",
      font: '20px Pixelated', 
      fontStyle: "bold",
      backgroundColor: "#FFA500", // Example background color
      padding: {
          left: 10,
          right: 10,
          top: 5,
          bottom: 5
      }
  }).setInteractive();

  // Create a background rectangle (optional: rounded corners)
  let background = scene.add.rectangle(buttonText.x, buttonText.y, buttonText.width, buttonText.height, 0xFFA500)
                   .setOrigin(0, 0)
                   .setInteractive();

  // Move the text in front of the rectangle
  buttonText.setDepth(1);

  // Add hover effect
  buttonText.on('pointerover', function () {
      buttonText.setStyle({ fill: '#ff0' }); // Change text color on hover
  });
  buttonText.on('pointerout', function () {
      buttonText.setStyle({ fill: '#FFF' }); // Change text color back
  });

  // Add click event
  buttonText.on('pointerdown', ()=>{
    socket.emit("stopMainSceneRequest",gameName);
  });

  return buttonText;
}
