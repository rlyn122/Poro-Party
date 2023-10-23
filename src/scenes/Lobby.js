import Phaser from "phaser";

export default class Lobby extends Phaser.Scene {
    constructor(){
        super("Lobby")
        this.state = {}
        this.hasBeenSet = false
    }

    //pass the socket to the lobby as well
    init(data){
        this.socket = data.socket
    }
}