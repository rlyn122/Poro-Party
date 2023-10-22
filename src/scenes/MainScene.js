import Phaser from "phaser";

export default class MainScene extends Phaser.Scene{
    
    constructor() {
        super("MainScene");
    }

    preload(){
        this.load.spritesheet("./../../assets/cats/Cat_1.png", {framewidth:263, frameheight:192,});
        this.load.image("bg","./../../assets/mainroom.png");
    }

    create(){
        const scene = this;
        //add background
        this.add.image(0,0,"bg").setOrigin(0);

        //create socket
        this.socket = io();
        console.log("Here!");
    }

    update(){}
}

