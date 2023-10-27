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
        let htmlString = this.cache.text.get('form');
        let domElement = this.add.dom(400, 300, null, null, htmlString);
    }

}
