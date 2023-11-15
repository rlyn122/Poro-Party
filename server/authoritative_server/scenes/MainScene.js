class MainScene extends Phaser.Scene {

    constructor(){
        super("MainScene");
    }

    //pass the socket to the MainScene as well
    init(data){
        this.socket = data.socket;
    }

}