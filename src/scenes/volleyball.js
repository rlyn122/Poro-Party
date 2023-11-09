import Phaser from "phaser";

export default class Volleyball extends Phaser.Scene{

    constructor(){
        super('Volleyball');
        this.state = {};
        this.gameOver = false;
    }

    preload() {
        this.load.image('sky', 'assets/volleyball/sky.png');
        this.load.image('ground', 'assets/volleyball/platform.png');
        this.load.image('net', 'assets/volleyball/platform2.png');
        this.load.image('ball', 'assets/volleyball/volleyball.png');
    }

    create(data) {


        

        const { cat, catUsernameText, otherPlayers, cursors, socket, state } = data;

        // Now access to all the transferred data
        this.cat = cat;
        this.catUsernameText = catUsernameText;

        this.otherPlayers = otherPlayers;
        this.cursors = cursors;
        this.socket = socket;
        this.state = state;


        //add players and usernames to the screen
        this.cat = this.add.existing(this.cat);
        this.cat.setDepth(1);
        this.add.existing(this.catUsernameText)
        this.catUsernameText.setDepth(1);

        this.otherPlayers.getChildren().forEach((otherPlayer)=>{
            console.log(otherPlayer);
            this.otherPlayer = this.add.existing(otherPlayer);
            this.otherPlayer.setDepth(1);
            this.add.existing(otherPlayer.usernameText)
            this.otherPlayer.usernameText.setDepth(1);

        })

        this.add.image(400, 300, 'sky');

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(400, 350, 'net').setScale(0.05, 7).refreshBody();


        this.ball = this.physics.add.sprite(400, 200, 'ball');
        this.ball.setBounce(1);
        this.ball.setCollideWorldBounds(true);
        this.ball.setVelocityX(100);

        // Create a graphics object for the glowing boundaries
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(8, 0xFFFF00, 0.6); // Yellow color with a bit of transparency
        // Draw a rectangle around the game boundaries
        this.graphics.strokeRect(4, 4, 792, 592); // Adjust the rectangle's position and size
        
        this.physics.world.createDebugGraphic();

    }
/**
    update() {
        if (!this.gameOver) {

            const speed = 225;
            //reset velocity from previous scen
            
            
            this.cat.body.setVelocity(0);

            if(this.cursors.left.isDown){
                this.cat.body.setVelocityX(-speed);
            } else if (this.cursors.right.isDown) {
                this.cat.body.setVelocityX(speed);
            }
            if(this.cursors.up.isDown){
                this.cat.body.setVelocityY(-speed);
            } else if (this.cursors.down.isDown){
                this.cat.body.setVelocityY(speed);
            }

            this.cat.body.velocity.normalize().scale(speed);
            
            var x = this.cat.x;
            var y = this.cat.y;

            this.socket.emit("playerMovement", {
                x: x,
                y: y,
                roomKey : this.state.roomKey
            })

            /**

            // Player-player collision handling
            if (Phaser.Geom.Intersects.RectangleToRectangle(player1.getBounds(), player2.getBounds())) {
                // Calculate the bounce effect
                player1.setVelocityX(player1.body.velocity.x);
                player2.setVelocityX(player2.body.velocity.x);
            }

            if (this.ball.y > 510) {
                // Ball has fallen to the ground
                this.gameOver = true;
                console.log("Game Over!");
            }

        } 
        else {
            this.ball.setVelocityX(0);
            this.ball.setVelocityY(0);
            
        }
    }

    hitVolleyball(player, ball) {
        ball.setVelocityY(-400);
        if (ball.x < player.x) {
            ball.setVelocityX(-200);
        } else {
            ball.setVelocityX(200);
        }

    } */
}