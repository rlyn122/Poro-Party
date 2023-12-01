class Soccer extends Phaser.Scene {

  constructor(){
      super("Soccer");
  }

  init(data){
    this.socket = data.socket;
  }

  preload() {
    //load sprites
    this.load.spritesheet('cat1', 'assets/cats/Cat_1.png', { frameWidth: 250, frameHeight: 184 });  
    this.load.spritesheet('cat2', 'assets/cats/Cat_2.png', { frameWidth: 250, frameHeight: 184 });  
    this.load.spritesheet('cat3', 'assets/cats/Cat_3.png', { frameWidth: 250, frameHeight: 184 });  
    this.load.spritesheet('cat4', 'assets/cats/Cat_4.png', { frameWidth: 250, frameHeight: 184 });  
    this.load.spritesheet('cat5', 'assets/cats/Cat_5.png', { frameWidth: 250, frameHeight: 184 });  
    this.load.spritesheet('cat6', 'assets/cats/Cat_6.png', { frameWidth: 250, frameHeight: 184 });  
    this.load.spritesheet('cat7', 'assets/cats/Cat_7.png', { frameWidth: 250, frameHeight: 184 });  
    this.load.spritesheet('cat8', 'assets/cats/Cat_8.png', { frameWidth: 250, frameHeight: 184 });  


    //load background
    this.load.image('soccer_background', 'assets/soccer/field.png');
    this.load.image('ball', 'assets/soccer/soccerball.png');
    this.load.image('soccer_ground', 'assets/soccer/grass.png');
    this.load.image('blue_goal', 'assets/soccer/blue_goal.png');
    this.load.image('red_goal', 'assets/soccer/red_goal.png');

    //sounds
    this.load.audio('soccer_bgm', 'assets/sounds/soccer.mp3');
    this.load.audio('yay', 'assets/sounds/yay.mp3');
    

  }

  create() {
    var self = this;
    this.players = this.add.group();

    console.log("Client-side Soccer Running")
    this.scene.launch("Rules_Soccer");

      //sounds
    this.yay = this.sound.add('yay');
    this.soccer_bgm = this.sound.add('soccer_bgm');
    this.soccer_bgm.play({
        loop: true
    });
    this.soccer_bgm.volume = 0.12;

    //add background

    this.add.image(400, 300, 'soccer_background');
    this.add.image(400, 568, 'soccer_ground').setScale(2);
    this.add.image(400, 600, 'soccer_ground').setScale(2).setTint(0);
    this.add.image(50, 415, 'red_goal').setScale(.1).setDepth(2);
    this.add.image(750, 415, 'blue_goal').setScale(-0.1, .1).setDepth(2);

    // create the first ball
    var ball = this.add.sprite(400, 200, 'ball').setScale(2);


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
    this.blueScoreTextSoccer = this.add.text(630, 26, 'Blue: 0', scoreTextStyle).setOrigin(0.5, 0);
    this.redScoreTextSoccer = this.add.text(190, 26, 'Red: 0', scoreTextStyle).setOrigin(0.5, 0);

    //listen for currentPlayers and self
    this.socket.on('currentPlayers_soccer', function (players) {
      Object.keys(players).forEach(function (id) {
        displayPlayersTeam(self, players[id], players[id].cat);
      });
    });

    //listen for player disconnection
    this.socket.on('disconnect_soccer', function (playerId) {
      self.players.getChildren().forEach(function (player) {
        if (playerId === player.playerId) {
          player.usernameText.destroy();
          player.destroy();
        }
      });
    });

    //update player movements and animations from server
    this.socket.on('playerUpdates_soccer', function (players) {
      Object.keys(players).forEach(function (id) {
        self.players.getChildren().forEach(function (player) {
          if (players[id].playerId === player.playerId) {
            player.setPosition(players[id].x, players[id].y);
            setUsername_Pos(player,players[id].x, players[id].y);
          }
        });
      });
    });

    //update ball positions
    this.socket.on('soccer_ballUpdates', function(ball_Pos) {
      const {ball_x, ball_y} = ball_Pos;
      ball.setPosition(ball_x,ball_y)
    })

    //score updates
    this.socket.on('scoreUpdate_soccer', function (scores) {
      console.log(scores)

      try{
      self.yay.play();
      self.blueScoreTextSoccer.setText(`Blue: ${scores.blueScore}`);
      self.redScoreTextSoccer.setText(`Red: ${scores.redScore}`);
      } catch(error){
        console.log(error)
      }
    });

    //create cursors
    this.cursors = this.input.keyboard.createCursorKeys();
    this.leftKeyPressed = false;
    this.rightKeyPressed = false;
    this.upKeyPressed = false;
    
    const centerX = this.scale.width * 0.5;
    const centerY = this.scale.height * 0.5;

    // 创建胜利文本样式
    const style = {
        font: '50px Pixelated', // 更具游戏感的字体
        fill: '#ffffff', // 更鲜艳的颜色
        stroke: '#000000', // 黑色描边
        strokeThickness: 5, // 描边的粗细
        shadow: { offsetX: 3, offsetY: 3, color: '#333', blur: 5, stroke: true, fill: true }
    };

    // 创建胜利文本，并初始化为隐藏
    this.soc_gameOverText = this.add.text(centerX, centerY, '', style).setOrigin(0.5, 0.5).setVisible(false);

    this.socket.on('gameOver_soccer', function(team) {
          if (team === 'red') {
            self.soc_gameOverText.setFill('#ff0000');
        } else if (team === 'blue') {
            self.soc_gameOverText.setFill('#0000ff');
        }
        // 设置文本内容
        self.soc_gameOverText.setText(team + " Won").setVisible(true);

        // 添加一个简单的动画效果
        self.tweens.add({
            targets: self.soc_gameOverText,
            scale: { from: 1, to: 1.5 },
            alpha: { start: 0, to: 1 },
            yoyo: true,
            repeat: 5,
            ease: 'Power1',
            duration: 800
        });
    });
  
    this.socket.on('stopSoccerScene', () => {
      self.soccer_bgm.stop();
      self.socket.emit("enableButtonsafterScene")
      self.scene.stop("Soccer");
    });

    this.players.children.iterate(function (player) {
      player.setDepth(10);
  });
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
      this.socket.emit('soccerInput', { left: this.leftKeyPressed , right: this.rightKeyPressed, up: this.upKeyPressed });
    }
  }
}


function displayPlayersTeam(scene, playerInfo, sprite) {
  if (playerInfo && sprite) {
    const player = scene.add.sprite(playerInfo.x, playerInfo.y, sprite).setScale(0.2, 0.2);
    if (player) {
      player.playerId = playerInfo.playerId;
      scene.players.add(player);

      // Determine the team color based on the even/odd index of the player
      const playerCount = scene.players.getLength();
      const teamColor = playerCount % 2 === 0 ? '#ff0000' : '#0000ff'; // Hex color for red or blue

      // Add the username with the team color
      addUsernameTeam(player, scene, playerInfo, teamColor);
    }
  }
}
