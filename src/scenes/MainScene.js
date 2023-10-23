import Phaser from "phaser";

export default class MainScene extends Phaser.Scene{
    
    constructor() {
        super("MainScene");
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
        
        //create socket
        this.socket = io();

        //launch Lobby
        scene.scene.launch("Lobby", {socket:scene.socket})

    }

    update(){

    }
}

