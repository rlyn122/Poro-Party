import Phaser from "phaser";

export default class MainScene extends Phaser.Scene{
    
    constructor() {
        super("MainScene");
        this.state = {
            numPlayers: 0, //number of players
            roomKey:0,
            players:0,
        };
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
        this.load.image("bg","assets/mainroom.png");
    }

    create(){


        const scene = this;
        //add background
        this.add.image(0,0,"bg").setOrigin(0);
        
        //set physics
        this.physics.world.setBounds(15, 95, 765, 470);

        //Allow all other players to have the same intrinisc physics properties by adding to physics group
        this.otherPlayers = this.physics.add.group();
        //create socket
        this.socket = io();
        
        //ADD BACK LATER launch Lobby
        scene.scene.launch("Login", {socket:this.socket});

        
        //sets the scene's state, including information such as roomkey, players, and numPlayers
        this.socket.on("setState",  (state) =>{
            const {roomKey,players,numPlayers,roomState} = state;
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
            scene.state.numPlayers = numPlayers;
            scene.addOtherPlayer(scene,playerInfo);
        })
        
        //listen for other player's Movement event and move otherPlayer's position based off that
        this.socket.on("OtherplayerMoved", (playerInfo)=>{
            scene.otherPlayers.getChildren().forEach((otherPlayer)=>{
                if(playerInfo.playerId == otherPlayer.playerId){
                    const x = playerInfo.x;
                    const y = playerInfo.y;
                    //update player positin and username info
                    otherPlayer.setPosition(x,y);
                    this.setUsername_Pos(otherPlayer,x,y); 
                }
            })
        })

        //listen for disconnection and destroy characters
        this.socket.on("disconnected", (arg)=>{
            const {playerId, numPlayers} = arg;
            scene.state.numPlayers = numPlayers;
            scene.otherPlayers.getChildren().forEach((otherPlayer)=>{
                //remove the sprite of the player that disconnected
                if(playerId == otherPlayer.playerId){
                    otherPlayer.usernameText.destroy();
                    otherPlayer.destroy();
                }
            });
            scene.playerCount.setText(`Lobby: ${scene.state.numPlayers}/4`)

        })

        this.playerCount = scene.add.text(0, 0, "Lobby: 0/4", {
            fill: "#7CFC00",
            fontSize: "20px",
            fontStyle: "bold",
        });
        
        //add cursors key object
        this.cursors = this.input.keyboard.createCursorKeys();
        

        this.physics.world.createDebugGraphic();


    }

    update(){

        
        const scene = this ;
        //movement
        if(this.cat && this.socket){ //check this cat exists

            const speed = 225;
            //reset velocity from previous scene

            //check if collisions occurred, if so emit event to server

            
        
            
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

            console.log(`${x},${y}`)
            //update username position
            
            this.setUsername_Pos(this.cat,x,y);
    
            
            
            //detect cat movement
            //if (this.cat.oldPosition && (x != this.cat.oldPosition.x || y!=this.cat.oldPosition.y))
            //{
                this.socket.emit("playerMovement", {
                    x: this.cat.x,
                    y: this.cat.y,
                    roomKey : scene.state.roomKey
                })
            //}

            //detect cat collision
            this.physics.world.overlap(this.cat,this.otherPlayers, (player,otherPlayer)=>{
                if(otherPlayer){
                scene.handlePlayerCollision(player.playerId,otherPlayer.playerId,this.state.roomKey)
                }
                
            })

            this.cat.oldPosition = {
                x: this.cat.x,
                y: this.cat.y,
            }
        }
    }

    //Collission handler
    handlePlayerCollision(playerId,otherPlayerId,roomKey){
        //emit a player collision
        this.socket.emit('playerCollision',{playerId,otherPlayerId,roomKey})
    }


    //addPlayer() adds your character to the screen, playerInfo includes your information passed from server and creates scene.cat!
    addPlayer(scene, playerInfo){
        scene.playerCount.setText(`Lobby: ${scene.state.numPlayers}/4`)
        scene.joined = true;
        
        scene.cat = scene.physics.add.sprite(playerInfo.x,playerInfo.y,playerInfo.cat);
        scene.cat.playerId = playerInfo.playerId;
        scene.cat.setScale(0.25);
        //scene.cat.setBounce(0);
        scene.cat.setCollideWorldBounds(true);
        this.physics.add.collider(scene.cat,scene.otherPlayers);
        scene.addUsername(scene.cat,scene,playerInfo);
    }   

    //add other players to your screen, playerInfo is another player's infor from the server
    addOtherPlayer(scene, playerInfo){
        this.playerCount.setText(`Lobby: ${scene.state.numPlayers}/4`)
        const otherPlayer = scene.physics.add.sprite(playerInfo.x,playerInfo.y,playerInfo.cat);
        otherPlayer.playerId = playerInfo.playerId;
        otherPlayer.setScale(0.25);
        otherPlayer.playerId = playerInfo.playerId;
        otherPlayer.setCollideWorldBounds(true);
        //otherPlayer.setBounce(0);
        //this.physics.add.collider(otherPlayer,scene.cat);
        scene.otherPlayers.add(otherPlayer);


        //Add username for otherPlayer
        this.addUsername(otherPlayer,scene,playerInfo); 
    }

    //function to add player username onto screen
    addUsername(player, scene, playerInfo){
        player.usernameText = scene.add.text(0,0,playerInfo.username, { font: '16px Arial', fill: '#ffffff' });
        this.setUsername_Pos(player,playerInfo.x,playerInfo.y)
    }

    setUsername_Pos(player, posX, posY){
        player.usernameText.x = posX-10;
        player.usernameText.y = posY- player.height / 4;
    }


}

