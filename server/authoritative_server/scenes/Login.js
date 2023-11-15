class Login extends Phaser.Scene {

    constructor(){
        super("Login");
    }

    //pass the socket to the Login as well
    init(data){
        this.socket = data.socket;
    }

}