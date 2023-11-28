class Dummy extends Phaser.Scene {

    constructor(){
        super("Dummy");
    }

    init(data){
        this.socket = data.socket
    }

    preload(){
        this.load.image("bg2","assets/bgload.jpg");
    }

    create(){
        var self = this
        this.players = this.add.group();
        this.add.image(0,0,"bg2").setOrigin(0);
        this.add.image(400, 568, 'ground');

        
        //ask server to send over player positions and players
        this.socket.emit("Loading Done");

        this.socket.on('displayPlayers', function (players) {
            console.log("displayplayers received")
            Object.keys(players).forEach(function (id) {
              //if it is this client
              if (players[id].playerId === self.socket.id) {
                displayPlayers(self, players[id], players[id].cat);
              }
              //if it is another client
              else{
                displayPlayers(self,players[id],players[id].cat);
              }
            })
        })

     //update player movements and animations from server
        this.socket.on('playerUpdates', function (players) {
            Object.keys(players).forEach(function (id) {
            self.players.getChildren().forEach(function (player) {
                if (players[id].playerId === player.playerId) {
                player.setPosition(players[id].x, players[id].y);

         `       if (player.anims.getCurrentKey() !== players[id].animationKey) {
                    player.anims.play(players[id].animationKey, true);
                }`
                }
            });
            });
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.leftKeyPressed = false;
        this.rightKeyPressed = false;
        this.upKeyPressed = false;

        }

    
    update(){
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
          this.socket.emit('vg_playerInput', { left: this.leftKeyPressed , right: this.rightKeyPressed, up: this.upKeyPressed });
        }
    }
}
