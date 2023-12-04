# Client Side Code
The code running on the client side is all contained in the `public/` directory

## index.js 
`index.js` contains the Phaser congifurations that setup the window and physics for the client to use

## index.html
`index.html` is the .html file that the client is given to run on the page

## assets/
`assets/` contains all of the sprites, used by their specific games, as well as all of the different cat sprites, that are seen on the server side

### letters
`letters/` contains the images of the letters that make up the **PORO PARTY** on the login page

## scenes/
The folder contains all the seperate Java Script files that run at different times on the webpage. The three files that contain the minigames have large sections of code that are very similar to each other. In addition to this, the Phaser 3 base functions, NodeJS sockets, and some shared variables are present. These similar chunks and variables will be covered in three sections, before expanding on the code that is unique to each. More information about Phaser 3 documentation can be found here: https://newdocs.phaser.io/docs/3.54.0/

### Phaser 3 Functions

`this.players` - Group defined using Phaser 3 to keep track of a specific class of sprites

`constructor()` - Function required by Phaser 3 to setup Scene subclass

`preload()` - Loads in the assets from the `assets/` folder that are displayed on thescreen 

`create()` - Creates game objects, called after `preload()` and before `update()`

`update()` - While the scene is active, contents of the function are continuously run

`load.x(name, location, (optional: size))` - Loads external content such as spritesheets, background images, and sprites, using a `location` from the project directory

`anims.create(config)` - Creates a new animation with the desired `config`

`sound.add(name)` - Creates an instance of the sound object with name `name`

`sound.play((optional: config))` - Plays a sound with an optional configuration `config`

`sound.volume` - Integer variable that sets the volume of the audio `sound` that is being played 

`scene.launch(scene,(optional: data))` - Launches a scene and sends some data to the given scene when launched.

`input.once(event, function())` - Calls `function()` when the specified `event` occurs

`n.setScrollFactor(x, (optional: y))` - Sets the speed at which a given object is tracked by a camera

`n.setScale(x, (optional: y = x))` - Sets the horizontal scale of the object to `x` and if the vertical scale is given, then it will set it to `y`, else both will be set to `x`

`n.setDepth(value)` - Sets the depth of an object `n`, or how low 'behind' it is in terms of other game objects

`n.setTint(value)` - Sets the tint of a given object

`n.play(x)` - Sets a game object `n` to play another object or animation `x`

`n.setPosition(x, y)` - Sets the x- and y- position of an object

`add.text(x, y, text, (optional: style))` - Adds the given `text` to the screen at the given coordinates `x, y`, applying the specified `style`

`n.setVisible(value)` - Sets the visibility of a game object `n` using the boolean `value`, a value of `true` sets the object to visible, while `false` makes it invisible

`n.destroy()` - Deletes the given sprite `n` from the screen

`input.keyboard.createCursorKeys()` - Creates and then subsequently returns the keyboard object that registers the inputs of up, down, left, and right arrow keys as well as the spacebar and shift

`add.graphics((optional: config))` - Creates a graphics object and adds it to the given scene

`text.setOrigin(x, y)` - Sets the origin of a given text object `text` at `x, y`

`text.setInteractive()` - Sets a given text object `text` to be interactable using user input

`graphics.fillStyle(color, (optional; alpha = 1))` - Sets how the given graphics object `graphics` should be filled

`n.fillRoundedRect(x, y, w, h, (optional: r))` - Creates and fills a rounded rectangle at position `x, y` with width `w` and height `h`, and with corner radius `r`

`new Phaser.Geom.Rectangle(x, y, w, h)` - Creates an instance of the rectangle class, with position `x, y` and width `w` and height `h`

`text.setStyle(style)` - Sets the style of a given text object `text` to `style`

`createButton()` - 

`sound()` - 

`sound.context()` - 

`sound.context.state()` - 

### Socket.io Functions

`io.on('connection', function(data))` - Runs a defined `function(data)` upon a new connection occurring from a client

`socket.on(disconnect, function(data))` - Runs a defined `function(data)` upon a disconnection occurring from a client

`socket.on(name, function())` - Runs a defined `function()` upon a signal `name` being sent from the client side

`io.emit(name)` - Emits a signal `name` to all clients

`socket.emit(name, data)` - Emits a signal `name` to all clients with some given `data`

### MainScene.js

`this.letters()` - Game object group that contains the letters that are displayed on the main screen

`this.players()` - Game object group that contains the players that are seen on screen

`frames` - Array of "gif_frames" .pngs that collectively contain the frames that will be run during the animation

`gifSprite` - Sprite that plays the background animation

`main_bgm` - Sound object that contains the music that runs during the main scene

`playerCount` - Integer variable containing the amount of players currently in the scene

`playerCountText` - Text object responsible for displaying the number of players currently in the scene to the client in the top-left corner

`startDodgeballGameButton` - Button object that allows the players to start the dodgeball game

`startVolleyGameButton` - Button object that allows the players to start the volleyball game

`startSoccerGameButton` - Button object that allows the players to start the soccer game

`gameInProgressSign` - Text object that displays to clients still in the main scene that a game is still in progress when other players are in a game

`cursors` - Keyboard object that contains the inputs that are currently being pressed by players

`leftKeyPressed` - Boolean that is set to the value of the client's left arrow key status, `true` if it is pressed, else `false`

`rightKeyPressed` - Boolean that is set to the value of the client's right arrow key status, `true` if it is pressed, else `false`

`upKeyPressed` - Boolean that is set to the value of the client's up arrow key status, `true` if it is pressed, else `false`

`left` - Boolean that contains the current state of the player's left arrow key, so it can be used for the rest of the `update()` function 

`right` - Boolean that contains the current state of the player's right arrow key, so it can be used for the rest of the `update()` function

`up` - Boolean that contains the current state of the player's up arrow key, so it can be used for the rest of the `update()` function

`displayPlayers(self, playerInfo, sprite)` - Displays players to the given scene `self` using information like x- and y-positions from `playerInfo`, with the given sprite object `sprite`

`addUsername(player, scene, playerInfo)` - Adds the specified `player`'s username to the given `scene` using the username that is given in the `playerInfo` object

`addUsernameTeam(player, scene, playerInfo, teamColor)` - Shows the team of the given `player` to them in the specified `scene` using the username that is given in the `playerInfo` object and the color by `teamColor`

`setUsername_Pos()` - 

`disableButtons()` - 

`setPosition()` - 