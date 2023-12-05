# Client Side Code
The code running on the client side is all contained in the `public/` directory

## index.js 
`index.js` contains the Phaser congifurations that setup the window and physics for the client to use

## index.html
`index.html` is the .html file that the client is given to run on the page

## assets/
`assets/` contains all of the sprites, used by their specific games, as well as all of the different cat sprites, that are seen on the server side. It also contains `codeform.html` which allows players to input their username and their chosen cat sprite and place it into the `players` object server-side.

### letters
`letters/` contains the images of the letters that make up the **PORO PARTY** on the login page

## scenes/
The folder contains all the seperate Java Script files that run at different times on the webpage. The three files that contain the minigames have large sections of code that are very similar to each other. In addition to this, the Phaser 3 base functions and NodeJS sockets. The rules for all the games are also coded very similar, so they will be covered in one section. More information about Phaser 3 documentation can be found here: https://newdocs.phaser.io/docs/3.54.0/

### Phaser 3 Functions

`this.players` - Group defined using Phaser 3 to keep track of a specific class of sprites, those that are used by the players

`constructor()` - Function required by Phaser 3 to setup Scene subclass

`preload()` - Loads in the assets from the `assets/` folder that are displayed on thescreen 

`create()` - Creates game objects, called after `preload()` and before `update()`

`update()` - While the scene is active, contents of the function are continuously run

`load.x(name, location, (optional: size))` - Loads external content such as spritesheets, background images, and sprites, using a `location` from the project directory

`anims.create(config)` - Creates a new animation with the desired `config`

`anims.play(name, value)` - Changes the animation of the current sprite `name` to either value `true`, to turn on the animation, or `false`, to stop the animation

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

`sound()` - 

`sound.context()` - 

`sound.context.state()` - 

`text.setShadow()` - 

`time.addEvent()` - 

`graphics.lineStyle()` - 

`graphics.fillStyle()` - 

`graphics.strokeRect()` - 

`graphics.fillRect()` - 

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

`setUsername_Pos(player, posX, posY)` - Positions the username of the `player` at a position above the given sprite at the center

`disableButtons(self)` - Disables the game buttons on the specified scene `self`

`createButtons(scene, x, y, text, gameName, socket)` - 
Creates a button on the specified scene `scene` at position `x, y`, with the specified `text` using the given `gameName` and the `socket` where the signal can be emitted from

### Loading.js

`this.letters()` - Group defined using Phaser 3 that contains the letters that are used in the loading screen

`letterx` - Integer variable containing the initial starting x-position of the letters that will be shown during the loading screen

`lettery` - Integer variable containing the initial starting x-position of the letters that will be shown during the loading screen

`dots` - String variable containing the dots that show up during the loading screen

`catSprite` - Sprite object containg the sprite animation used for the loading screen

### Login.js

`scene.popUp` - Graphics object containing the login popup that occurs when entering the web page

`scene.boxes` - Graphics object containing the box that will contain the rest of the text used for the login page

`scene.titleImage` - Image object that indicates where the text for the title will be placed

`JoinRoomButton` - Text object that indicates to the user how to join the room

`inputElement` - DOM (Document Object Model) object defined with Phaser 3 that contains the html provided by `codeform.html`

`form` - Form element that is placed in the document using `codeform.html`

`notValidText` - Text object to indicate to the user that the username they entered is not valid

### Dodgeball.js

`this.players()` - Game object group that contains the players that are seen on screen

`dodge_bgm` - Sound object created for the dodgeball game when the players enter

`ball` - Game object created for the "earth" ball

`ball2` - Game object created for the "mars" ball

`ball3` - Game object created for the "saturn" ball

`leftKeyPressed` - Boolean that is set to the value of the client's left arrow key status, `true` if it is pressed, else `false`

`rightKeyPressed` - Boolean that is set to the value of the client's right arrow key status, `true` if it is pressed, else `false`

`upKeyPressed` - Boolean that is set to the value of the client's up arrow key status, `true` if it is pressed, else `false`

`centerX` - Double variable containing the x-position of the center of the screen

`centerY` - Double variable containing the y-position of the center of the screen

`gameOverTextStyle` - Style object that has the styling for the text that indicates to the user that the game is over

`left` - Boolean that contains the current state of the player's left arrow key, so it can be used for the rest of the `update()` function 

`right` - Boolean that contains the current state of the player's right arrow key, so it can be used for the rest of the `update()` function

`up` - Boolean that contains the current state of the player's up arrow key, so it can be used for the rest of the `update()` function

`displayPlayers(self, playerInfo, sprite)` - Displays players to the given scene `self` using information like x- and y-positions from `playerInfo`, with the given sprite object `sprite`

### Soccer.js

`this.players()` - Game object group that contains the players that are seen on screen

`yay` - Sound object that plays when a team scores a goal

`ball` - Game object that is used in the game as the soccer ball

`blueScoreBg` - Graphics object indicating where the blue team's score will be shown

`redScoreBg` - Graphics object indicating where the red team's score will be shown

`blueScoreTextSoccer` - Text object showing the blue team's score

`redScoreTextSoccer` - Text object showing the red team's score

`leftKeyPressed` - Boolean that is set to the value of the client's left arrow key status, `true` if it is pressed, else `false`

`rightKeyPressed` - Boolean that is set to the value of the client's right arrow key status, `true` if it is pressed, else `false`

`upKeyPressed` - Boolean that is set to the value of the client's up arrow key status, `true` if it is pressed, else `false`

`centerX` - Double variable containing the x-position of the center of the screen

`centerY` - Double variable containing the y-position of the center of the screen

`style` - Style object containing the CSS styling for the `soc_gameOverText`

`soc_gameOverText` - Text object showing the winner of the game

`left` - Boolean that contains the current state of the player's left arrow key, so it can be used for the rest of the `update()` function 

`right` - Boolean that contains the current state of the player's right arrow key, so it can be used for the rest of the `update()` function

`up` - Boolean that contains the current state of the player's up arrow key, so it can be used for the rest of the `update()` function

`displayPlayersTeam(scene, playerInfo, sprite)` - Changes the username from the given `playerInfo` in the scene so that their `sprite` has a different username above them based on their team

### Volleyball.js

`this.players()` - Game object group that contains the players that are seen on screen

`yay` - Sound object that plays when a team scores a point

`volley_bgm` - Sound object that plays during the whole volleyball game

`ball` - Game object that is used in the game as the volleyball

`scoreTextStyle` - The CSS styling used for the text that shows the game score

`blueScoreBg` - Graphics object indicating where the blue team's score will be shown

`redScoreBg` - Graphics object indicating where the red team's score will be shown

`blueScoreTextVolleyball` - Text object showing the blue team's score

`redScoreTextVolleyball` - Text object showing the red team's score

`leftKeyPressed` - Boolean that is set to the value of the client's left arrow key status, `true` if it is pressed, else `false`

`rightKeyPressed` - Boolean that is set to the value of the client's right arrow key status, `true` if it is pressed, else `false`

`upKeyPressed` - Boolean that is set to the value of the client's up arrow key status, `true` if it is pressed, else `false`

`centerX` - Double variable containing the x-position of the center of the screen

`centerY` - Double variable containing the y-position of the center of the screen

`style` - Style object containing the CSS styling for the `volley_gameOverText`

`volley_gameOverText` - Text object showing the winner of the game

`left` - Boolean that contains the current state of the player's left arrow key, so it can be used for the rest of the `update()` function 

`right` - Boolean that contains the current state of the player's right arrow key, so it can be used for the rest of the `update()` function

`up` - Boolean that contains the current state of the player's up arrow key, so it can be used for the rest of the `update()` function

### Rules_X.js

`scene.popUp` - Graphics object containing the rules popup that occurs when entering the game

`scene.boxes` - Graphics object containing the box that will contain the rest of the text used for the rules popup

`rulesText` - Text object containing the rules for the game

`rules` - Array of strings containing the rules for the game

`rulesList` - CSS styling for the rules of the game

`timerText` - Text object containing the timer showing the amount of time left before the game starts

`timerInterval` - Interval object that counts down and incrementally changes the seconds displayed in `timerText`