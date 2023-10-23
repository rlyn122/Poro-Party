import Phaser from "phaser";

export default class MainScene extends Phaser.Scene{
    
    constructor() {
        super("MainScene");
        this.state = {};
    }

    preload(){
        this.load.spritesheet("cat1", "assets/cats/Cat_2.png", {frameWidth:250, frameHeight:184,});
        this.load.image("bg","assets/mainroom.png");
    }

    create(){
        console.log("Create!");

        const scene = this;
        //add background
        this.add.image(0,0,"bg").setOrigin(0);

        //Allow all other players to have the same intrinisc physics properties by adding to physics group
        this.otherPlayers = this.physics.add.group();
        
        //create socket
        this.socket = io();
        
        //ADD BACK LATER launch Lobby
        //scene.scene.launch("Lobby", {socket:scene.socket})

        //TEST CODE: sockets to join scene, let this player join room 200
        this.socket.emit("joinRoom",{
            key:200,
            username: this.socket.id
        })

        //sets the scene's state, including information such as roomkey, players, and numPlayers
        this.socket.on("setState", function (state) {
            const {roomKey,players,numPlayers} = state;
            scene.physics.resume();
            scene.state.roomKey = roomKey;
            scene.state.players = players;
            scene.state.numPlayers = numPlayers;
        })

        //add current players to the screen
        this.socket.on("currentPlayers", function(arg) {
            const {players,numPlayers} = arg;
            scene.state.numPlayers=numPlayers;
            Object.keys(players).forEach(function (id){
                //if the player is the current user
                if(players[id].playerId == scene.socket.id) {
                    scene.addPlayer(scene, players[id]);
                }
                //if the players are other users
                else{
                    scene.addOtherPlayers(scene,players[id]);
                }
            });
        });

        //
        this.socket.on("newPlayer", function(arg){
            const {playerInfo, numPlayers} = arg;
            scene.addOtherPlayers(scene,playerInfo);
            scene.state.numPlayers = numPlayers;
        })

        scene.physics.resume();

    }

    update(){

    }

    //add your character to screen
    addPlayer(scene, playerInfo){
        this.scene.cat = scene.physics.add
        .sprite(playerInfo.x,playerInfo.y,"cat1")
        .setOrigin(0.5,0.5)
        .setSize(30,40)
        .setOffset(0,24)
    }

    //add other players to your screen
    addOtherPlayers(scene, playerInfo){
        const otherPlayer = scene.add.sprite(playerInfo.x+Math.random()*500,playerInfo.y+Math.random()*500,"cat1");
        otherPlayer.playerId = playerInfo.playerId;
        scene.otherPlayers.add(otherPlayer);
    }
}

