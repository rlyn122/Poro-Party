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

    //check if entered room is valid
    this.socket.on('isKeyValid', (data)=>{
        if(GameRooms.hasOwnProperty(data.key)){
        this.socket.emit("KeyisValid", data);
        }
        else{
        this.socket.emit("KeyNotValid",data);
        }
    })


    //joinRoom code
  this.socket.on('joinRoom', (data) => {
    
    const roomKey = String(data.key);
    const roomInfo = GameRooms[roomKey];

    this.socket.roomKey = roomKey;

    //add player to sockertIO room
    this.socket.join(roomKey);
    // create a new player and add it to our players object
    players[this.socket.id] = {
      x: Math.floor(Math.random() * 700) + 50,
      y: 500,
      playerId: this.socket.id,
      input: {
          left: false,
          right: false,
          up: false
      },
      username: data.username, 
      cat:data.cat,
      };


    //add new player data to roomInfo
    roomInfo.players[this.socket.id] = {
      cat:data.cat,
      rotation:0,
      x:400,
      y:300,
      points: 0,
      username: data.username, 
      playerId: this.socket.id,
      power: null,
      roomState:0
    }

    //update number of Players
    roomInfo.numPlayers =Object.keys(roomInfo.players).length;
    console.log(`${roomInfo.players[this.socket.id].username} joined room ${roomKey}. Room data: `)
    console.log(roomInfo);
    
    //Emit initial state of game for client
    this.socket.emit("setState", roomInfo);

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