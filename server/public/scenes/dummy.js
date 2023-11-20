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

        }

}

function displayPlayers(self, playerInfo, sprite) {
    const player = self.add.sprite(playerInfo.x, playerInfo.y, sprite).setScale(0.2,0.2);
    addUsername(player,self,playerInfo)
    player.playerId = playerInfo.playerId;
    self.players.add(player);
  }
  
