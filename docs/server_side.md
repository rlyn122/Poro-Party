# Server Side Code
The code running on the server side is all contained in the `authoritative_server/` directory

## index.js
`index.js` contains the Phaser configurations that setup the window and physics for the server to use

## index.html
`index.html` is the .html file that the server runs on the page

## assets/
`assets/` contains all of the sprites, used by their specific games, as well as all of the different cat sprites, that are run on the server side

### letters
`letters/` contains the images of the letters that make up the **PORO PARTY** on the login page

## scenes/
The folder contains all the seperate Java Script files that run at different times on the webpage. The three files that contain the minigames have large sections of code that are very similar to each other. In addition to this, the Phaser 3 base functions, NodeJS sockets, and some shared variables are present. These similar chunks and variables will be covered in three sections, before expanding on the code that is unique to each.

### Login.js


### Shared Variables

`players` - Array object to store the data on all clients, or players, currently connected to the server; shared to all the minigame files

`gameActive` - Variable to track the status of whether a minigame is in progress

`this.players` - Seperate from the `players` object defined before, this 

### Phaser 3 Functions

`constructor()` - Function required by Phaser 3 to setup Scene subclass

`preload()` - Phaser 3 function loads in the assets from the `assets/` folder that are used for the game physics. Only a single cat sprite needs to be loaded, since having different variations of the same model does not matter on the server-side.

`create()` - Phaser 3 function to create game objects, called after `preload()` and before `update()`

