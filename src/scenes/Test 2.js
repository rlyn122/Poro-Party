import Phaser from "phaser";

export default class Test extends Phaser.Scene {

    constructor(){
        super("Test");
        this.state = {};
        this.hasBeenSet = false;
    }

    preload(){

        this.load.text('form', 'assets/text/codeform.html');

    }

    create(){
        const element = this.add.dom(400, 600).createFromHTML('form');
        element.setVisible(true);
        console.log("form created2")

    }

}
