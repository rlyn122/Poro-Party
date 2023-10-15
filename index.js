// Import required modules
const express = require('express');
const app = express();
const server = require('http').createServer(app); 
const io = require('socket.io')(server, {cors:{origin:"*"}});
const path = require("path");

// Middleware to serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to send the login.html file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/login.html"));
});

// Set up socket.io connection handling
io.on('connection', function(socket){
    console.log('user connected with socketId ' + socket.id);

    // Listen for the arrowKeyPressed event
    socket.on('arrowKeyPressed', function(arrowKey) {
        console.log(`Arrow key pressed: ${arrowKey}`);
    });

    socket.on('event', function(data){
        console.log('event fired');
    });

    socket.on('disconnect', function(){ 
        console.log('user disconnected');
    }); 
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log("Server running on port 3000");
});
