const express = require("express")
const app = express()
const port = 3000
var server = require('http').Server(app);
var io = require('socket.io')(server);


app.use(express.static(__dirname + '/public'));


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
  });

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  });

server.listen(port, ()=>{
    console.log(`Listening at http://localhost:${port}`)
})