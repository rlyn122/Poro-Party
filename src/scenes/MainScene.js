import Phaser from "phaser";

export default class MainScene extends Phaser.Scene{
    
    constructor() {
        super("MainScene");
        this.state = {};
    }

    preload(){
        this.load.spritesheet("cat1", "assets/cats/Cat_1.png", {frameWidth:263, frameHeight:194});
        this.load.spritesheet("cat2", "assets/cats/Cat_2.png", {frameWidth:250, frameHeight:184});
        this.load.spritesheet("cat3", "assets/cats/Cat_3.png", {frameWidth:250, frameHeight:184});
        this.load.spritesheet("cat4", "assets/cats/Cat_4.png", {frameWidth:250, frameHeight:184});
        this.load.spritesheet("cat5", "assets/cats/Cat_5.png", {frameWidth:250, frameHeight:184});
        this.load.spritesheet("cat6", "assets/cats/Cat_6.png", {frameWidth:250, frameHeight:184});
        this.load.spritesheet("cat7", "assets/cats/Cat_7.png", {frameWidth:250, frameHeight:184});
        this.load.spritesheet("cat8", "assets/cats/Cat_8.png", {frameWidth:250, frameHeight:184});

        this.load.image("bg","assets/mainroom.png");
    }

    create(){

        const scene = this;
        //add background
        this.add.image(0,0,"bg").setOrigin(0);

        //Allow all other players to have the same intrinisc physics properties by adding to physics group
        this.otherPlayers = this.physics.add.group();
        
        //create socket
        this.socket = io();
        
        //ADD BACK LATER launch Lobby
        scene.scene.launch("Login", {socket:this.socket});

        
        //sets the scene's state, including information such as roomkey, players, and numPlayers
        this.socket.on("setState",  (state) =>{
            const {roomKey,players,numPlayers} = state;
            scene.physics.resume();

            //set state object
            scene.state.roomKey = roomKey;
            scene.state.players = players;
            scene.state.numPlayers = numPlayers;
            console.log(scene.state);
        });

        //arg is an object with players object and numPlayers variable
        this.socket.on("currentPlayers", (arg)=>{
            const {players,numPlayers} = arg;
            scene.state.numPlayers=numPlayers;
            //parse through id's and check:
            Object.keys(players).forEach( (id)=>{
                if(players[id].playerId == scene.socket.id) { //if the player is the client user
                    scene.addPlayer(scene, players[id]);}
                else{ //other players online
                    scene.addOtherPlayer(scene,players[id]);} 
            });
        });

        //inform already open client that a new player has joined room
        this.socket.on("newPlayer", function(arg){
            const {playerInfo, numPlayers} = arg;
            scene.addOtherPlayer(scene,playerInfo);
            scene.state.numPlayers = numPlayers;
        })
        
        //listen for other player's Movement event and move otherPlayer's position based off that
        this.socket.on("OtherplayerMoved", (playerInfo)=>{
            console.log("Received OtherplayerMoved event"); // Check if the event is received
            console.log(playerInfo); // Check the data received from the server

            scene.otherPlayers.getChildren().forEach((otherPlayer)=>{
                if(playerInfo.playerId == otherPlayer.playerId){
                    otherPlayer.setPosition(playerInfo.x,playerInfo.y);
                    console.log("otherplayer moved");
                }
            })
        })

        this.socket.on("disconnected", (arg)=>{
            const {playerId, numPlayers} = arg;
            scene.state.numPlayers = numPlayers;
            scene.otherPlayers.getChildren().forEach((otherPlayer)=>{
                //remove the sprite of the player that disconnected
                if(playerId == otherPlayer.playerId){
                    otherPlayer.destroy();
                }
            });
        })

        //add cursors key object
        this.cursors = this.input.keyboard.createCursorKeys();

    }

    update(){
        
        const scene = this ;
        //movement
        if(this.cat && this.socket){ //check this cat exists
            const speed = 225;
            //reset velocity from previous scene
            
            this.cat.body.setVelocity(0);

            if(this.cursors.left.isDown){
                this.cat.body.setVelocityX(-speed);
            } else if (this.cursors.right.isDown) {
                this.cat.body.setVelocityX(speed);
            }
            if(this.cursors.up.isDown){
                this.cat.body.setVelocityY(-speed);
            } else if (this.cursors.down.isDown){
                this.cat.body.setVelocityY(speed);
            }

            this.cat.body.velocity.normalize().scale(speed);
            
            var x = this.cat.x;
            var y = this.cat.y;
            
            //detect cat movement
            if (this.cat.oldPosition && (x != this.cat.oldPosition.x || y!=this.cat.oldPosition.y))
            {
                this.moving = true;
                this.socket.emit("playerMovement", {
                    x: this.cat.x,
                    y: this.cat.y,
                    roomKey : scene.state.roomKey

                })
            }

            this.cat.oldPosition = {
                x: this.cat.x,
                y: this.cat.y,
            }
        }

        


    }

    //addPlayer() adds your character to the screen, playerInfo includes your information passed from server and creates scene.cat!
    addPlayer(scene, playerInfo){
        scene.joined = true;
        
        scene.cat = scene.physics.add.sprite(playerInfo.x,playerInfo.y,playerInfo.cat);
        scene.cat.setScale(0.25)    }

    //add other players to your screen, playerInfo is another player's infor from the server
    addOtherPlayer(scene, playerInfo){
        const otherPlayer = scene.add.sprite(playerInfo.x,playerInfo.y,playerInfo.cat);
        otherPlayer.setScale(0.25);
        otherPlayer.playerId = playerInfo.playerId;
        scene.otherPlayers.add(otherPlayer);
        console.log(otherPlayer);
        
    }
}

