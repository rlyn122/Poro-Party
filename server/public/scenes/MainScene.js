class MainScene extends Phaser.Scene {

    constructor(){
        super("MainScene");
        this.playerCount = 0;
    }
    
    preload(){
        //load cats
        this.load.spritesheet("cat1", "assets/cats/Cat_1.png", {frameWidth:250, frameHeight:184});
        this.load.spritesheet("cat2", "assets/cats/Cat_2.png", {frameWidth:250, frameHeight:184});
        this.load.spritesheet("cat3", "assets/cats/Cat_3.png", {frameWidth:250, frameHeight:184});
        this.load.spritesheet("cat4", "assets/cats/Cat_4.png", {frameWidth:250, frameHeight:184});
        this.load.spritesheet("cat5", "assets/cats/Cat_5.png", {frameWidth:250, frameHeight:184});
        this.load.spritesheet("cat6", "assets/cats/Cat_6.png", {frameWidth:250, frameHeight:184});
        this.load.spritesheet("cat7", "assets/cats/Cat_7.png", {frameWidth:250, frameHeight:184});
        this.load.spritesheet("cat8", "assets/cats/Cat_8.png", {frameWidth:250, frameHeight:184});

        //load background
        this.load.image('lobbyground', 'assets/dodgeball/lobbyground.png');
        this.load.image('p1', 'assets/platform1.png');
        this.load.image('p2', 'assets/platform2.png');
        this.load.image('p3', 'assets/platform3.png');

        //sounds
        this.load.audio('main_bgm', 'assets/sounds/minecraft.mp3');

        //background
        for (let i = 0; i <= 238; i++) {
          let frameNumber = i.toString().padStart(3, '0');
          this.load.image(`gif_frame_${i}`, `assets/gif_frames/frame_${frameNumber}_delay-0.04s.png`);
      }
    }

    create() {
        var self = this;
        this.socket = io();

        this.scene.launch("Login", {socket:this.socket});

        this.letters = this.add.group();
        this.players = this.add.group();

        this.input.once('pointerdown', function () {
          // Check if the audio context is in a suspended state (this is usually true by default)
          if (self.sound && self.sound.context && self.sound.context.state === 'suspended') {
              self.sound.context.resume().then(() => {
                  console.log('Playback resumed successfully');
                  // Now that the audio context is resumed, start the audio
                  self.main_bgm.play({ loop: true });
              });
          }
       });

        //add background
        let frames = [];
        for (let i = 0; i <= 238; i++) {
            frames.push({ key: 'gif_frame_' + i });
        }
        
        this.anims.create({
            key: 'gif_animation',
            frames: frames,
            frameRate: 25,  //取决于您的GIF的帧率
            repeat: -1  //无限循环
        });
        
        let gifSprite = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'gif_frame_0');
        gifSprite.setScrollFactor(0);
        gifSprite.setScale(1.4);
        gifSprite.setDepth(-100);  // 确保GIF背景位于其他游戏元素的后面
        gifSprite.play('gif_animation');

        //platforms
        this.add.image(400, 600, 'lobbyground').setScale(2).setTint(0); 
        this.add.image(450,450,'p1').setScale(0.1);
        this.add.image(700,375,'p1').setScale(0.1);
        this.add.image(500,300,'p3').setScale(0.1);
        this.add.image(600,200,'p2').setScale(0.1);
        this.add.image(300,350,'p2').setScale(0.1);  
        
        //play bgm in loop
        this.main_bgm = this.sound.add('main_bgm');
        this.main_bgm.play({
            loop: true
        });
        this.main_bgm.volume = 1;

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
              self.main_bgm.volume = 0;
              disableButtons(self)
            });

            self.socket.on('enableButtons',()=>{
              self.main_bgm.volume = 1;
              enableButtons(self)
            });
          });
        })
        
        //receive signals to launch games from server
        this.socket.on("DodgeballGame", ()=>{
          this.main_bgm.volume = 0;
          this.scene.launch("Dodgeball",{socket:self.socket})
        })

        //launch volleyball game from here
        this.socket.on("VolleyballGame", ()=>{
          this.main_bgm.volume = 0;
          this.scene.launch("Volleyball",{socket:self.socket})
        })

        //launch soccer game from here
        this.socket.on("SoccerGame", ()=>{
          this.main_bgm.volume = 0;
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
  let buttonText = scene.add.text(x+100, y+15, text, {
      fill: "#ffffff",
      font: '20px GameFont', 
      fontStyle: "bold",
      stroke: '#000000',
      strokeThickness: 3,
  }).setOrigin(0.5, 0.5).setInteractive();

  // Create a background rectangle (optional: rounded corners)
  let background = scene.add.graphics();
    background.fillStyle(0xD87968, 1);
    background.fillRoundedRect(x, y, 200, 30, 15);
  let hitArea = new Phaser.Geom.Rectangle(x, y, 200, 50);
  background.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);


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
