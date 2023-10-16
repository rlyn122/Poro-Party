const socket = io();
        
        socket.on("roomCreated", (key)=>{
            console.log("roomCreated ", key);
        })

        socket.on("RoomDNE", (key)=>{
            console.log(`room ${key} does not exist`);
        })

        socket.on("newPlayer",(playerInfo)=>{
            console.log(`A new player ${playerInfo.playerId} has joined your room, num players = ${playerInfo.numPlayers}`);
        })

        

        document.addEventListener('keydown', function(event) {
            // Check if the key pressed is an arrow key
                if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                    // Emit an event to the server with the key pressed
                    socket.emit('arrowKeyPressed', event.key);
                }
            });


        function joinRoom(event) {
            event.preventDefault();
            
            const username = document.getElementById('username').value;
            const code = document.getElementById('code').value;
    
            // Create an object to hold the form data
            const formData = {
                username: username,
                key: code
            };
    
            // Emit the form data to the server
            socket.emit('joinRoom', formData);
        }

        function createRoom(event) {
            event.preventDefault();
    
            // Emit the form data to the server
            socket.emit('createRoom', );
        }