const path = require('path');
const jsdom = require('jsdom');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const { JSDOM } = jsdom;
const Datauri = require('datauri');
const datauri = new Datauri();

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

function setupAuthoritativePhaser() {
  JSDOM.fromFile(path.join(__dirname, 'authoritative_server/index.html'), {
    // To run the scripts in the html file
    runScripts: "dangerously",
    // Also load supported external resources
    resources: "usable",
    // So requestAnimatinFrame events fire
    pretendToBeVisual: true
  }).then((dom) => {

    //add phaser functions that JSDOM does not support
    dom.window.URL.createObjectURL = (blob) => {
      if (blob){
        return datauri.format(blob.type, blob[Object.getOwnPropertySymbols(blob)[0]]._buffer).content;
      }
    };
    dom.window.URL.revokeObjectURL = (objectURL) => {};
    
    dom.window.gameLoaded = () => {
      server.listen(process.env.PORT || 8081, function () {
        console.log(`Listening on ${server.address().port}`);
      });
    };
    dom.window.io = io;
  }).catch((error) => {
    console.log(error.message);
  });
}

setupAuthoritativePhaser();
