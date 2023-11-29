class Login extends Phaser.Scene {

    constructor(){
        super("Login");
    }

    init(data){
        this.socket = data.socket;
    }

    preload(){

    }

    create(){

    //Creates a new lobby with the code
    this.socket.on('getRoomCode', () => {
        // Generate room code 
        let key = codeGen();
        // Check code does not already exist
        while (Object.keys(GameRooms).includes(key))
        {
        key = codeGen();
        }
        //create room with key
        GameRooms[key] = 
        {
        gameScore: 0,
        players: {},
        numPlayers: 0,
        roomState: 0,
        roomKey:key
        };
        
        this.socket.emit("roomCreated", key)
        });

    }

    update(){

    }

}

var code_length = 5;

//generate room codes with code_length
function codeGen() {
    let code = "";
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = characters.length;
    for (i = 0 ; i<code_length ; i++){
      code+=characters.charAt(Math.floor(Math.random()*length))
    }
    return code;
  }