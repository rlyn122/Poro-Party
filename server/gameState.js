//event handling code and gameroom data
const code_length = 5;
const GameRooms = {
  //[roomKey]: {
  //gameScore: 0,
  //players: {},
    //[players]: {
      //cat:1-8 (whichever cat the person selects)
      //rotation: 0,
      //x: 400,
      //y: 300,
      //playerId: socket.id,
      //power: null
  // numPlayers: Object.keys(roomInfo.players).length,
  // state: 0  (0 - login/waiting room, 1 - Main Lobby, 2->5 - minigames )
  // roomKey
  // }
}

//test room
GameRooms[200] = {
  gameScore: 0,
  players: {},
  numPlayers: 0,
  state: 0,
  roomKey:200
};

module.exports = (io) => {
  
io.on('connection', (socket)=>{
  console.log('user connected with socketId '+socket.id);

  //Listen for a joinRoom user to a lobby with the same code
  //TODO: add code checking for room isvalid
  socket.on('isKeyValid', (data)=>{
    if(GameRooms.hasOwnProperty(data.key)){
      socket.emit("KeyisValid", data);
    }
    else{
      socket.emit("KeyNotValid",data);
    }
  })

  socket.on('joinRoom', (data) => {
  

    const roomKey = data.key;
    const roomInfo = GameRooms[roomKey];

    //add player to sockertIO room
    socket.join(roomKey);
    
    //add new player data to roomInfo
    roomInfo.players[socket.id] = {
      cat:data.cat,
      rotation:0,
      x:400,
      y:300,
      points: 0,
      username: data.username, 
      playerId: socket.id,
      power: null
    }

    //update number of Players
    roomInfo.numPlayers =Object.keys(roomInfo.players).length;
    console.log(`${roomInfo.players[socket.id].username} joined room ${roomKey}. Room data: `)
    console.log(roomInfo);
    
    //Emit initial state of game for client
    socket.emit("setState", roomInfo);
    
    //send current players object to new player (players in the room before joining)
    socket.emit("currentPlayers", {
      players: roomInfo.players,
      numPlayers: roomInfo.numPlayers
     });


     //emit to the room of new player arrival (players in the room after joining)
     socket.to(roomKey).emit("newPlayer", {
      playerInfo:roomInfo.players[socket.id],
      numPlayers:roomInfo.numPlayers
     })
      
  });

  //listen for movement event and update player object
  socket.on("playerMovement", (arg)=>{

    const {x, y, roomKey} = arg
    
    const Key = GameRooms[roomKey].roomKey;

    //error handling
    if(x!=undefined && y!=undefined){

    if (!GameRooms[roomKey]){
      console.error(`Room ${roomKey} DNE`)
      return
    }

    const playersinRoom = GameRooms[roomKey].players;

    if (!playersinRoom) {
      console.error(`Players property for room ${roomKey} does not exist.`);
      return;
  }

    if (!playersinRoom[socket.id]) {
        console.error(`Player with socket id ${socket.id} does not exist in room ${roomKey}.`);
        return;
    }
    const playerInfo = GameRooms[roomKey].players[socket.id];

    //update position on player object on server
    playerInfo.x = x;
    playerInfo.y = y;
  
    //emit to all players the player has moved
    socket.to(JSON.stringify(roomKey)).emit("OtherplayerMoved", playerInfo);
    }
  }) ;


  //Creates a new lobby with the code
  socket.on('getRoomCode', () => {
    // Generate room code 
    let key = codeGen();
    // Check code does not already exist
    while (Object.keys(GameRooms).includes(key)){
      key = codeGen();
    }
    //create room with key
    GameRooms[key] = {
      gameScore: 0,
      players: {},
      numPlayers: 0,
      state: 0,
      roomKey:key
    };
    
    socket.emit("roomCreated", key)
});
  
  socket.on('disconnect', ()=>{ 
    console.log(`user ${socket.id} has disconnected`);

    //Find which room they are in
    let roomKey;

    //find what room key player is in by iterating through all roomKeys and players
    for(const room in GameRooms){
      for(const player in GameRooms[room].players){
          if(GameRooms[room].players[player].playerId==socket.id){
            roomKey = room;
            break;
          }
      }
      if(roomKey){
        break;
      }
    }
  


  if(roomKey) {
  roomInfo = GameRooms[roomKey];
  //Remove player from gameRoom data
  delete roomInfo.players[socket.id];
  //update numPlayers
  roomInfo.numPlayers = Object.keys(roomInfo.players).length;

  //Disconnect player from socket.io room

  io.to(roomKey).emit("disconnected", {
    playerId: socket.id,
    numPlayers: roomInfo.numPlayers
  });
  }
}); 
  
  });
  };



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