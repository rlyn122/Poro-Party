const socket = io();
        
        socket.on("roomCreated", (key)=>{
            console.log("roomCreated ", key)
        })

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