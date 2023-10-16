//event handling code and gameroom data

const GameRooms = {
    //[roomKey]: {
  // gameScore: 0,
  // players: {},
  // numPlayers: 0
  // }
}

module.exports = (io) => {
  
io.on('connection', (socket)=>{

  console.log('user connected with socketId '+socket.id);

  //Adds user to a lobby with the same code
  socket.on('joinRoom', (data) => {
      console.log('Received form data:', data.username, data.key);
      // Add new player to room code
      const roomInfo = GameRooms[data.key];
      roomInfo.players[socket.id] = {
        //rotation:0,
        //x:400,
        //y:300,
        //points: 0,
        username: data.username,
        playerId: socket.id
      }
      console.log(roomInfo);

  });

  //Creates a new lobby with the code and enters the user in
  socket.on('createRoom', () => {
    // Generate room code 
    let key = codeGen();
    while (Object.keys(GameRooms).includes(key)){
      key = codeGen();
    }
    //create room with key
    GameRooms[key] = {
      gameScore: 0,
      players: {},
    };

    console.log('Room Generated!');
    console.log(GameRooms[key])
    socket.emit("roomCreated", key)
});
  
  socket.on('disconnect', ()=>{ 
      console.log('user disconnected');
      //add code for removing from parties
  }); 
});
};


//generate room codes
const code_length = 5;

function codeGen() {
  let code = "";
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = characters.length;
  for (i = 0 ; i<code_length ; i++){
    code+=characters.charAt(Math.floor(Math.random()*length))
  }
  return code;
}