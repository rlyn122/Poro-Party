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
  // }
}

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
  socket.on('joinRoom', (data) => {
    //add player to sockertIO room
    socket.join(data.key);

    const roomKey = data.key;
    const roomInfo = GameRooms[roomKey];
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
    socket.emit("setState", roomInfo)
    
    //send current players object to new player
    socket.emit("currentPlayers", {
      players: roomInfo.players,
      numPlayers: roomInfo.numPlayers
     });


     //emit to the room of new player arrival
     socket.to(roomKey).emit("newPlayer", {
      playerInfo:roomInfo.players[socket.id],
      numPlayers:roomInfo.numPlayers
     })
      
  });

  //listen for movement event and update player object
  socket.on("playerMovement", (arg)=>{
    const {x, y, roomKey} = arg
    GameRooms[roomKey].players[socket.id].x = x;
    GameRooms[roomKey].players[socket.id].y = y;

    //emit to all players the player has moved
    socket.to(roomKey).emit("playerMoved",GameRooms[roomKey].players[socket.id]);
  }) ;


  //Creates a new lobby with the code
  socket.on('createRoom', () => {
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
      state: 0
    };

    console.log(`User ${socket.id} generated room ${key}`)
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

  // Listen for the arrowKeyPressed event
  socket.on('arrowKeyPressed', function(arrowKey) {
    console.log(`Arrow key pressed: ${arrowKey}`);
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