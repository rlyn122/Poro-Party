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
        this.load.image('ground', 'assets/volleyball/platform.png');

    }

    create() {

        var self = this;
        this.socket = io();

        this.scene.launch("Login", {socket:this.socket});

        this.players = this.add.group();

        //add background
        this.add.image(0,0,"bg").setOrigin(0);
        this.add.image(400, 600, 'ground').setScale(2).setTint(0); 

        this.add.image(100,450,'ground').setScale(0.3);
        this.add.image(500,300,'ground').setScale(0.3);
        this.add.image(600,200,'ground').setScale(0.3);
        this.add.image(300,350,'ground').setScale(0.3);


        //add PoroParty letters
        /**
        var letterx = 100
        this.letters.P = this.add.sprite(50,letterx,"P").setScale(0.35);
        this.letters.O = this.add.sprite(120,letterx,"O").setScale(0.35);
        this.letters.R = this.add.sprite(190,letterx,"R").setScale(0.35);
        this.letters.O1 = this.add.sprite(250,letterx,"O").setScale(0.35);

        this.letters.P1 = this.add.sprite(310,letterx,"P").setScale(0.35);
        this.letters.A = this.add.sprite(370,letterx,"A").setScale(0.35);
        this.letters.R = this.add.sprite(460,letterx,"R").setScale(0.35);
        this.letters.T = this.add.sprite(550,letterx,"T").setScale(0.35);
        this.letters.Y = this.add.sprite(700,letterx,"Y").setScale(0.35);
      */

        //listen for currentPlayers and self
        this.socket.on('currentPlayers', function (players) {
          Object.keys(players).forEach(function (id) {
      
            //if it is this client
            if (players[id].playerId === self.socket.id) {
              displayPlayers(self, players[id], 'cat4');
            }
            //if it is another client
            else{
              displayPlayers(self,players[id],'cat5')
            }

            
            self.startGameButton = self.add.text(625,20,"Start Game!",{
              fill: "#FFFFFF",
              fontSize: "20px",
              fontStyle: "bold",
            });

            //set initial playerCount
            self.playerCount = (Object.keys(players).length)
            self.playerCountText = self.add.text(50, 20, `Lobby: ${(Object.keys(players).length)} players`, {
                fill: "#7CFC00",
                fontSize: "20px",
                fontStyle: "bold",
              });
            //set startbutton interactive and tell the server

            self.startGameButton.setInteractive();
            self.startGameButton.on("pointerdown", () => {
            //emit to everyone in your room that the game has started
            self.socket.emit("stopMainSceneRequest");
          });
          });
        });
      
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
      
      //displays  
      function displayPlayers(self, playerInfo, sprite) {
        const player = self.add.sprite(playerInfo.x, playerInfo.y, sprite).setScale(0.2,0.2);
      
        self.anims.create({
          key: 'left',
          frames: self.anims.generateFrameNumbers('cat', { start: 0, end: 1 }),
          frameRate: 5,
          repeat: -1
        });
      
        self.anims.create({
          key: 'turn',
          frames: [{ key: 'cat', frame: 2 }],
          frameRate: 20
        });
      
        self.anims.create({
          key: 'right',
          frames: self.anims.generateFrameNumbers('cat', { start: 2, end: 3 }),
          frameRate: 5,
          repeat: -1
        });
      
        player.playerId = playerInfo.playerId;
        self.players.add(player);
      }

