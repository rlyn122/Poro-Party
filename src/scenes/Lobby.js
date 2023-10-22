import Phaser from "phaser";

export default class Lobby extends Phaser.Scene{
    constructor() {
        super("Lobby");
    }

    preload(){
        this.load.spritesheet("./../../assets/cats/Cat_1.png", 
        {framewidth:263, frameheight:192,});
        this.load.image('bg',"./../../assets/Lobbybackground.jpeg")
    }

    create(){
        const scene = this;
        this.add.image(0,0,'bg').setOrigin(0);

        //create socket
        this.socket = io();

        scene.scene.launch("WaitingRoom", {socket:scene.socket})
    }

    update(){}
}

