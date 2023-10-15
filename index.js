//create express server
const express = require('express');
const app = express();
//variable is the instance of http server we are creating
const server = require('http').createServer(app); 
const io = require('socket.io')(server, {cors:{origin:"*"}});
const path = require("path");


//send HTML file
app.get("/", (req,res) => {
    res.sendFile(path.join(path.join(__dirname, "public/login.html")))
})

io.on('connection', function(socket){

    console.log('user connected with socketId '+socket.id);

    socket.on('event', function(data){
        console.log('event fired');
    });

    socket.on('disconnect', function(){ 
        console.log('user disconnected');
    }); 

});

server.listen(3000, ()=>{
    console.log("Server running on port 3000")
});