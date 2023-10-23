//event handling code and gameroom data
const code_length = 5;
const GameRooms = {
  //[roomKey]: {
  //gameScore: 0,
  //players: {},
    //[players]: {
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
  state: 0
};

module.exports = (io) => {
  
io.on('connection', (socket)=>{
  console.log('user connected with socketId '+socket.id);
  //Listen for a joinRoom user to a lobby with the same code
  socket.on('joinRoom', (data) => {
    
    //check if room exists
    try{
    const roomInfo = GameRooms[data.key];
    console.log(roomInfo);
    //add new player data to roomInfo
    roomInfo.players[socket.id] = {
      rotation:0,
      x:400,
      y:300,
      points: 0,
      username: data.username, 
      playerId: socket.id,
      power: null
    }

    //TODO: change to Object.keys(roomInfo.players).length; later
    roomInfo.numPlayers +=1;
    console.log(`Player ${roomInfo.players[socket.id].username} has joined ${data.key}`);

    //add player to sockertIO room
    socket.join(data.key);
    
    //set initial state
    socket.emit("setState",roomInfo)
    
    //send current players object to new player
    socket.emit("currentPlayers",{
      players: roomInfo.players,
      numPlayers: roomInfo.numPlayers
     });
    
    //emit only to players in the socketIO room of the new player
    socket.to(data.key).emit("newPlayer", {
      playerInfo: roomInfo.players[socket.id],
      numPlayers: roomInfo.numPlayers
    });
    
    }

    //user enters a room that has not been created
    catch(error){
      console.log(`Room ${data.key} does not exist or ${error}`);
    }
  });



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
    let key = 0;

    //find what room key player is in
    for(const roomKey in GameRooms){
      if (GameRooms.hasOwnProperty(roomKey)){
      for(const playerId in GameRooms[roomKey].players){
        if (GameRooms[roomKey].players.hasOwnProperty(playerId) && GameRooms[roomKey].players[playerId].playerId == socket.id)
        {
          key = roomKey;
        }
      }
    }
  }

    //if the player has joined a room
  if (GameRooms[key] != undefined && GameRooms[key].hasOwnProperty(players)){
  //Remove player from gameRoom data
  delete GameRooms[key].players[socket.id];
  GameRooms[key].numPlayers = Object.keys(roomInfo.players).length;

  //Disconnect player from socket.io room
  io.to(key).emit("disconnected", {
    playerId: socket.id,
    numPlayers: GameRooms[key].numPlayers
  })
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