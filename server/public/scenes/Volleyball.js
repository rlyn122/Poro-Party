class Volleyball extends Phaser.Scene {

  constructor(){
      super("Volleyball");
  }

  init(data){
    this.socket = data.socket;
  }
  
   preload() {
    //load sprites
    this.load.spritesheet("cat1", "assets/cats/Cat_1.png", {frameWidth:250, frameHeight:184});
    this.load.spritesheet("cat2", "assets/cats/Cat_2.png", {frameWidth:250, frameHeight:184});
    this.load.spritesheet("cat3", "assets/cats/Cat_3.png", {frameWidth:250, frameHeight:184});
    this.load.spritesheet("cat4", "assets/cats/Cat_4.png", {frameWidth:250, frameHeight:184});
    this.load.spritesheet("cat5", "assets/cats/Cat_5.png", {frameWidth:250, frameHeight:184});
    this.load.spritesheet("cat6", "assets/cats/Cat_6.png", {frameWidth:250, frameHeight:184});
    this.load.spritesheet("cat7", "assets/cats/Cat_7.png", {frameWidth:250, frameHeight:184});
    this.load.spritesheet("cat8", "assets/cats/Cat_8.png", {frameWidth:250, frameHeight:184});
  
    //load background
    this.load.image('volleyball_background', 'assets/volleyball/sky.png');
    this.load.image('net', 'assets/volleyball/platform2.png');
    this.load.image('volleyball', 'assets/volleyball/volleyball.png');
    this.load.image('volley_ground', 'assets/volleyball/platform.png');

    //sounds
    this.load.audio('volley_bgm', 'assets/sounds/volleyball.mp3');
    this.load.audio('yay', 'assets/sounds/yay.mp3');
  }
  
   create() {
    var self = this;
    this.players = this.add.group();

    console.log("Client-side Volleyball Running")
    this.scene.launch("Rules_Volleyball");

    //sounds
    this.yay = this.sound.add('yay');
    this.yay.volume = 0.7
    this.volley_bgm = this.sound.add('volley_bgm');
    this.volley_bgm.play({
        loop: true
    });
    this.volley_bgm.volume = 0.12;

    //add background
    this.add.image(400, 300, 'volleyball_background');
    this.add.image(400, 568, 'volley_ground').setScale(2.3)
    this.add.image(400, 600, 'volley_ground').setScale(2.3).setTint(0)

    this.add.image(400, 350, 'net').setScale(0.5).setRotation(Phaser.Math.DegToRad(90));
  
    // create the ball
    var ball = this.add.sprite(400, 200, 'volleyball');

    const scoreTextStyle = {
      font: '32px GameFont', // 更具游戏感的字体
      fill: '#ffffff', // 白色文字
      stroke: '#000000', // 黑色描边
      strokeThickness: 6,
      shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 2, stroke: true, fill: true }
  };

    // 创建蓝队的圆角矩形背景
    this.blueScoreBg = this.add.graphics();
    this.blueScoreBg.fillStyle(0x4da2ee, 1); // 背景颜色
    this.blueScoreBg.fillRoundedRect(560, 25, 140, 40, 20); // 圆角矩形

    // 创建红队的圆角矩形背景
    this.redScoreBg = this.add.graphics();
    this.redScoreBg.fillStyle(0xe3170d, 1); // 背景颜色
    this.redScoreBg.fillRoundedRect(120, 25, 140, 40, 20); // 圆角矩形

    // 添加计分文本
    this.blueScoreTextVolleyball = this.add.text(630, 26, 'Blue: 0', scoreTextStyle).setOrigin(0.5, 0);
    this.redScoreTextVolleyball = this.add.text(190, 26, 'Red: 0', scoreTextStyle).setOrigin(0.5, 0);

  
    //listen for currentPlayers and self
    this.socket.on('currentPlayers_volley', function (players) {
      Object.keys(players).forEach(function (id) {
        displayPlayersTeam(self, players[id], players[id].cat);
      });
    });
  
    //listen for player disconnection
    this.socket.on('disconnect_volleyball', function (playerId) {
      try{
      self.players.getChildren().forEach(function (player) {
        if (playerId === player.playerId) {
          player.usernameText.destroy();
          player.destroy();
        }
      });
    }
      catch(error){}
    });
  
    //update player movements and animations from server
    this.socket.on('playerUpdates_volley', function (players) {
      Object.keys(players).forEach(function (id) {
        self.players.getChildren().forEach(function (player) {
          if (players[id].playerId === player.playerId) {
            player.setPosition(players[id].x, players[id].y);
            setUsername_Pos(player,players[id].x, players[id].y);
            // if (player.anims.getName() !== players[id].animationKey) {
            //   player.anims.play(players[id].animationKey, true);
            // }
          }
        });
      });
    });
  
    //update ball positions
    this.socket.on('ballUpdates', function(ball_Pos) {
      const {ball_x, ball_y} = ball_Pos;
      ball.setPosition(ball_x, ball_y);
    });

    this.socket.on('scoreUpdate_volley', function (scores) {
      self.yay.play();
      self.blueScoreTextVolleyball.setText(`Blue: ${scores.blueScore}`);
      self.redScoreTextVolleyball.setText(`Red: ${scores.redScore}`);
    });
  
    //create cursors
    this.cursors = this.input.keyboard.createCursorKeys();
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
    this.upKeyPressed = false;



    const centerX = this.scale.width * 0.5;
    const centerY = this.scale.height * 0.5;

    const style = {
        font: '50px Pixelated',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 5,
        shadow: { offsetX: 3, offsetY: 3, color: '#333', blur: 5, stroke: true, fill: true }
    };

    this.volley_gameOverText = this.add.text(centerX, centerY, '', style).setOrigin(0.5, 0.5).setVisible(false);

    this.socket.on('gameOver_volley', function(team) {
          if (team === 'red') {
            self.volley_gameOverText.setFill('#ff0000');
        } else if (team === 'blue') {
            self.volley_gameOverText.setFill('#0000ff');
        }
        self.volley_gameOverText.setText(team + " Won").setVisible(true);

        self.tweens.add({
            targets: self.volley_gameOverText,
            scale: { from: 1, to: 1.5 },
            alpha: { start: 0, to: 1 },
            yoyo: true,
            repeat: 5,
            ease: 'Power1',
            duration: 800
        });
    });

  
    this.socket.on('stopVolleyballScene', () => {
      self.volley_bgm.stop();
      self.socket.emit("enableButtonsafterScene")
      self.scene.stop("Volleyball");
    });
    this.players.children.iterate(function (player) {
      player.setDepth(10);
  });

    this.socket.emit("volleyloaded");

  }
  
   update() {
  
    const left = this.leftKeyPressed;
    const right = this.rightKeyPressed;
    const up = this.upKeyPressed;
  
    //handle cursor inputs
    //added new movements and cleaned up control/inputs
    if (this.cursors.right.isDown) {
      this.rightKeyPressed = true;
      this.leftKeyPressed = false;
      this.upKeyPressed = false;
    } 
    else if (this.cursors.left.isDown) {
      this.leftKeyPressed = true;
      this.rightKeyPressed = false;
      this.upKeyPressed = false;
    } 
    else{
      this.leftKeyPressed = false;
      this.rightKeyPressed = false;
      this.upKeyPressed = false;
    }
    if (this.cursors.up.isDown) {
      this.upKeyPressed = true;
    }
    //if the state of a key has been changed, emit the state of keys to server
    if ( left !== this.leftKeyPressed || right !== this.rightKeyPressed || up !== this.upKeyPressed) {
      this.socket.emit('volleyInput', { left: this.leftKeyPressed , right: this.rightKeyPressed, up: this.upKeyPressed });
    }
  }
  
  }
  