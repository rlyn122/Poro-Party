class Dummy extends Phaser.Scene {

    constructor(){
        super("Dummy");
    }

    init(data){
        this.socket = data.socket
        this.io = data.io
    }

    preload() {
        this.load.spritesheet("cat1", "assets/cats/Cat_1.png", {frameWidth:250, frameHeight:184});
        //load background
        this.load.image('sky', 'assets/volleyball/spaceship.png');
        this.load.image('net', 'assets/volleyball/platform2.png');
        this.load.image('earth', 'assets/volleyball/earth.png');
        this.load.image('mars', 'assets/volleyball/mars.png');
        this.load.image('saturn', 'assets/volleyball/saturn.png');
        this.load.image('ground', 'assets/volleyball/platform2.png');
      }

    create(){
        
        var self = this
        this.players = this.add.group();

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        
        //add all players in  players to this game
        Object.keys(players).forEach(function (id) {
            addPlayer(self, players[id]);
          })
        
        this.physics.add.collider(this.players,this.players);
        this.physics.add.collider(this.players,this.platforms);

        
        //send players to the game so they can be loaded in
        self.socket.on("Loading Done", ()=>{
            console.log("Loading Done event received")
            self.io.emit("displayPlayers", players)
        })

        // when a player moves, update the player data
        self.socket.on('vg_playerInput', function (inputData) {
            vg_handlePlayerInput(self,self.socket.id,inputData)
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

function vg_handlePlayerInput(self, playerId, input) {
    self.players.getChildren().forEach((player) => {
      if (playerId === player.playerId) {
        players[player.playerId].input = input;    }   
    });
  }

  
//create sprite for player
function addPlayer(self, playerInfo) {
    const player = self.physics.add.sprite(player.Info, playerInfo, 'cat1');
  
    // Set initial animation state
    player.playerId = playerInfo.playerId;
    self.players.add(player);
    player.setBounce(0.2);
    player.setScale(0.15, 0.15);  
    player.setCollideWorldBounds(true);
}