// Import required modules
const express = require('express');
const app = express();
const server = require('http').createServer(app); 
const io = require('socket.io')(server, {cors:{origin:"*"}});
const path = require("path");
const gameState = require('./gameState.js'); // Import the Socket.io setup module

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

//send HTML file
app.get("/", (req,res) => {
    res.sendFile(path.join(path.join(__dirname, "../public/test.html")))
})

//error handling endware
app.use((err,req,res,next)=>{
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message||"Internal server error");
})

// Initialize socket by passing the instance of the server to the exported function
gameState(io);

const port = 3000
server.listen(process.env.PORT || port);
