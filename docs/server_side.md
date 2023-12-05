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
The folder contains all the seperate Java Script files that run at different times on the webpage. The three files that contain the minigames have large sections of code that are very similar to each other. In addition to this, the Phaser 3 base functions, NodeJS sockets, and some shared variables are present. These similar chunks and variables will be covered in three sections, before expanding on the code that is unique to each. More information about Phaser 3 documentation can be found here: https://newdocs.phaser.io/docs/3.54.0/

### Shared Variables

`players` - Array object to store the data on all clients, of each player, currently connected to the server; shared to all the minigame files. Contains the following properties:

| Property | Description |
| ----- | -------|
| x | X position of player (integer) |
| y | Y Position of player (integer) |
| playerId | id of player (same as socketId) (string) |
| input {left, right, up}  | Inputs on player's keyboard (Array of boolean variables)
| username | username of player (string) |
| cat | sprite (object) |
| invuln | if player can be killed (boolean) |
| alive | if player is alive (string) |

`gameActive` - Variable to track the status of whether a minigame is in progress

`this.players` - Seperate from the `players` object defined before, this is a group defined using Phaser 3 to keep track of a specific class of sprites

### Phaser 3 Functions

`constructor()` - Function required by Phaser 3 to setup Scene subclass

`preload()` - Loads in the assets from the `assets/` folder that are used for the game physics. Only a single cat sprite needs to be loaded, since having different variations of the same model does not matter on the server-side

`create()` - Creates game objects, called after `preload()` and before `update()`

`update()` - While the scene is active, contents of the function are continuously run

`load.x(name, location, (optional: size))` - Loads external content such as spritesheets, background images, and sprites, using a `location` from the project directory

`n.create(x, y, asset)` - Creates a member of group `n` at position `x,y` using the image `asset`

`n.setScale(x, (optional: y = x))` - Sets the horizontal scale of the object to `x` and if the vertical scale is given, then it will set it to `y`, else both will be set to `x`

`n.setTint(value)` - Sets the tint of a given object

`n.refreshBody()` - Connect the member's presence on screen to the parent group

`physics.add.collider(group1, group2, (optional: function ()))` - Sets up a default collider to handle the collision between two groups of objects, and having them bounce off each other. If a function is given, then it will instead be called when a collision occurs

`scene.launch(scene,(optional: data))` - Launches a scene and sends some data to the given scene when launched.

`n.getChildren()` - Returns an array of all objects in a given group

`scene.manager.getScenes()` - Returns an array of all scene object that are currently managed by Phaser's Scene Manager

`scene.isActive()` - Returns true if the given scene is active, else false

`physics.add.sprite(x, y, spritesheet)` - Creates a sprite at position `x,y` with the sprite given by `spritesheet`

`n.setVelocityX(speed)` - Sets the velocity in the x direction of a given object `n` to `speed`, positive values move the object to the right, and negative values move the object to the left

`n.setVelocity(x, y)` - Sets the x-velocity of an object `n` to `x` and its y-velocity to `y`

`n.setVelocityY(speed)` - Sets the velocity in the y direction of a given object `n` to `speed`, positive values move the object downwards, and negative values move the object upwards

`n.setPosition(x, y)` - Sets the x- and y- position of an object

`n.setBounce(factor)` - Sets the amount of elasticity a given object has, with 0 indicating that it will not bounce at all, and 1 indicating that it will bounce back with all of its kinetic energy

`n.setCollideWorldBounds((optional: value = true))` - Sets whether a sprite collides with the bounds of the world (screen), `true` will create the collision, `false` will not

`n.body.allowGravity` - Boolean that determines whether an object `n` is affected by gravity, `false` if they are not, `true` if they are, the latter of which is the default

`n.destroy()` - Deletes the given sprite `n` from the screen

`game.config.width` - Variable containing the width initially set by the configuration

`game.config.height` - Variable contatining the height initially set by the configuration

`time.addEvent( {delay, callback()} )` - Adds a function `callback()` to take place after a time `delay`, measured in milliseconds

`scene.stop(scene)` - Causes the given scene to stop 

### Socket.io

`io.on('connection', function(data))` - Runs a defined `function(data)` upon a new connection occurring from a client

`socket.on(disconnect, function(data))` - Runs a defined `function(data)` upon a disconnection occurring from a client

`socket.on(name, function())` - Runs a defined `function()` upon a signal `name` being sent from the client side

`io.emit(name)` - Emits a signal `name` to all clients

`socket.id` - String variable generated by the socket, unique to each connected client

`socket.emit(name, data)` - Emits a signal `name` to all clients with some given `data`

`socket.broadcast.emit(name, data)` - Emits a signal `name` with some given `data`, however the socket that sent the signal is not included

### MainScene.js

`var name_exists` - Boolean to check if the username submitted by the client is already taken

`isAnyOtherSceneActive()` - Checks if any scene, other than MainScene is active, returns `true` if there is, else `false`

`addPlayer(self, playerInfo)` - Creates a sprite for a player using the given `playerInfo` in the scene specified by `self`, adds that player to the Phaser 3 `this.players()` group, and gives the sprite the required physics

`removePlayer(self, playerId)` - Removes a player with id `playerId` from the given scene `self`

### Soccer.js

`balls` - Group that contains all balls objects in the scene, of which there is only one

`gameOver_byDefault` - Boolean that tracks whether the game will be determined to be over by a default condition, usually when there are no players in the game, set to `false` initially, and if the game is not over, will be `true` otherwise

`blueScore` - Integer that indicates blue team's score

`redScore` - Integer that indicates red team's score

`playerCountSoccer` - Integer that is equal to the number of players in the game

`randomX` - Random integer in the bounds of the screen width that will be the x-position of a player

`yPos` - Position to place a player at in the y-direction, 100 pixels above the bottom of the screen

`gameOver` - Boolean to check whether the game is over, initially set to `false`

`speed` - Integer that contains the desired speed objects should be running at, set to 250

`input` - Array of booleans that are taken from the player's information from the player object, i.e. {left, right, up}

`animationKey` - String containing the desired animation that should be shown on a sprite, taken from the spritesheet

`ball_x` - Integer containing the soccer ball's current x position

`ball_y` - Integer containing the soccer ball's current y position

`countdown` - Integer initially set to 5 that decrements within the timerInterval

`timerInterval` - Object that decrements `countdown`, upon the variable reaching 0, emits to the clients to stop the Soccer.js scene, set `gameActive` to `false` and stops the Soccer.js scene on the server side

`getSoccerWinner(blueScore, redScore)` - Returns a string that contains the winner of the game, `"Blue"` if the blue team won, `"Red"` if the red team won, else `null`, given the scores of each team

`endGameSoccer(self, reason)` - Sets `gameOver_byDefault` to `true` for the given scene, `self`, and prints to the console the `reason`

### Volleyball.js

`balls` - Group that contains all balls objects in the scene, of which there is only one

`gameOver_byDefault` - Boolean that tracks whether the game will be determined to be over by a default condition, usually when there are no players in the game, set to `false` initially, and if the game is not over, will be `true` otherwise

`randomX` - Random integer in the bounds of the screen width that will be the x-position of a player

`yPos` - Position to place a player at in the y-direction, 100 pixels above the bottom of the screen

`blueScore` - Integer that indicates blue team's score

`redScore` - Integer that indicates red team's score

`playerCountVolleyball` - Integer that is equal to the number of players in the game

`b` - Integer containing the blue score, will be sent to the clients

`r` - Integer containing the red score, will be sent to the clients

`speed` - Integer that contains the desired speed objects should be running at, set to 250

`input` - Array of booleans that are taken from the player's information from the player object, i.e. {left, right, up}

`animationKey` - String containing the desired animation that should be shown on a sprite, taken from the spritesheet

`ball_x` - Integer containing the volleyball's current x position

`ball_y` - Integer containing the volleyball's current y position

`countdown` - Integer initially set to 5 that decrements within the timerInterval

`timerInterval` - Object that decrements `countdown`, upon the variable reaching 0, emits to the clients to stop the Volleyball.js scene, set `gameActive` to `false` and stops the Volleyball.js scene on the server side

`hitVolleyball(player, ball)` - Function called by the collision handler for objects in the groups of players and balls. Sets the velocity of the ball in the y-direction to -500, and sets its x-velocity to positive or negative 350, if the ball is to the right or left of the player, respectively

`getVolleyballWinner(blueScore, redScore)` - Returns a string that contains the winner of the game, `"Blue"` if the blue team won, `"Red"` if the red team won, else `null`, given the scores of each team

`endGameVolleyball(self, reason)` - Sets `gameOver_byDefault` to `true` for the given scene, `self`, and prints to the console the `reason`

### Dodgeball.js

`balls` - Group that contains all balls objects in the scene, of which there are 3

`gameOver` - Boolean that tracks whether the game is over, initially set to false

`gameOver_byDefault` - Boolean that tracks whether the game will be determined to be over by a default condition, usually when there are no players in the game, set to `false` initially, and if the game is not over, will be `true` otherwise

`playerCountDodgeball` - Integer that is equal to the number of players in the game

`randomX` - Random integer in the bounds of the screen width that will be the x-position of a player

`yPos` - Position to place a player at in the y-direction, 100 pixels above the bottom of the screen

`ball_x` - Integer containing ball 1's current x position

`ball_y` - Integer containing ball 1's current y position

`ball2_x` - Integer containing ball 2's current x position

`ball2_y` - Integer containing ball 2's current y position

`ball3_x` - Integer containing ball 3's current x position

`ball3_y` - Integer containing ball 3's current y position

`countdown` - Integer initially set to 10 that decrements within the timerInterval

`timerInterval` - Object that decrements `countdown`, upon the variable reaching 0, emits to the clients to stop the Dodgeball.js scene, set `gameActive` to `false` and stops the Dodgeball.js scene on the server side

`handlePlayerInput(self, playerId, input)` - Sets the input array held in the players object for the player given by `playerId` to the given `input` in the specified scene `self`. This function is also called by all other scenes on the server side

`hitDodgeball(player, ball)` - Function called by the collision handler for the groups of players and balls. If the given `player`'s invuln property is `true` then the ball will bounce off of them. Otherwise, the player will be moved under the screen, so as to not remove their sprite, their alive property be changed to `"dead"`

`getWinnerName()` - Returns a string containing the username of the winning player, and sets their invuln property to `true`. If no players are currently in the game, returns `"nobody"`. If neither of the above conditions are true, returns `null`.

`endGameDodgeball(self, reason)` - Sets `gameOver_byDefault` to `true` for the given scene, `self`, and prints to the console the `reason`