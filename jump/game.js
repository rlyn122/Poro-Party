class PlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlayScene' });
        this.lastCloudY = 500;
        this.clouds = [];
        this.lastDirection = null;
    }

    preload() {
        this.load.spritesheet('hero', 'assets/cat.png', { frameWidth: 263, frameHeight: 192 });
        this.load.image('pixel', 'assets/pixel_1.png');
        this.load.image('background', 'assets/background4.jpg');

        this.load.image('gif_frame_1', 'assets/gif_frames/backgroundFrame1.png');
        this.load.image('gif_frame_2', 'assets/gif_frames/backgroundFrame2.png');
        this.load.image('gif_frame_3', 'assets/gif_frames/backgroundFrame3.png');
        this.load.image('gif_frame_4', 'assets/gif_frames/backgroundFrame4.png');
        this.load.image('gif_frame_5', 'assets/gif_frames/backgroundFrame5.png');
        this.load.image('gif_frame_6', 'assets/gif_frames/backgroundFrame6.png');
        this.load.image('gif_frame_7', 'assets/gif_frames/backgroundFrame7.png');
        this.load.image('gif_frame_8', 'assets/gif_frames/backgroundFrame8.png');
        this.load.image('gif_frame_9', 'assets/gif_frames/backgroundFrame9.png');
        this.load.image('gif_frame_10', 'assets/gif_frames/backgroundFrame10.png');
        this.load.image('gif_frame_11', 'assets/gif_frames/backgroundFrame11.png');
        this.load.image('gif_frame_12', 'assets/gif_frames/backgroundFrame12.png');
        

        for (let i = 1; i <= 7; i++) {
            this.load.image('cloud' + i, 'assets/cloud' + i + '.png');
        }

        for (let i = 1; i <= 5; i++) {
            this.load.image('platform' + i, 'assets/platform' + i + '.png');
        }
        
        this.load.audio('bgm', 'assets/bgm.mp3');
        this.load.audio('jump', 'assets/jump.wav');
        this.load.audio('collision', 'assets/collision.wav');

        
    }

    isOverlappingWithClouds(x, y) {
        for (let cloud of this.clouds) {
            if (Phaser.Geom.Intersects.RectangleToRectangle(new Phaser.Geom.Rectangle(x-25, y-4, 50, 8), cloud.getBounds())) {
                return true;
            }
        }
        return false;
    }
    

    cloudCreate(y) {
        let x = Phaser.Math.Between(0, this.cameras.main.width);
        let type = Phaser.Math.Between(1, 7);
        let cloud = this.add.image(x, y, 'cloud' + type);
        if ([1, 2].includes(type)) {
            cloud.setScale(0.05);
        }
        else if ([4,].includes(type)) {
            cloud.setScale(0.02);
        }
        else if ([3,].includes(type)) {
            cloud.setScale(0.05);
        }
        else {
            cloud.setScale(1);
        }
        cloud.setDepth(-1);  // Ensure the cloud appears behind other game elements

        this.clouds.push(cloud);
    }
    

    create() {
        //this.cameras.main.setBackgroundColor('#6bf');

        //let background = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'background');
        //background.setScale(this.cameras.main.width / background.width, this.cameras.main.height / background.height);
        //background.setDepth(-2);  // Ensure the background is behind all other game elements
        //background.setScrollFactor(0);

        let frames = [];
        for (let i = 1; i <= 12; i++) {
            frames.push({ key: 'gif_frame_' + i });
        }
        
        this.anims.create({
            key: 'gif_animation',
            frames: frames,
            frameRate: 20,  // 这取决于您的GIF的帧率
            repeat: -1  // 无限循环
        });
        
        let gifSprite = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'gif_frame_1');
        gifSprite.setScrollFactor(0);
        gifSprite.setScale(0.27);
        gifSprite.setDepth(-100);  // 确保GIF背景位于其他游戏元素的后面
        gifSprite.play('gif_animation');
        
        
        this.cameraYMin = 99999;
        this.platformYMin = 99999;

        this.platformsCreate();
        this.heroCreate();

        this.physics.add.collider(this.hero, this.platforms);
        this.physics.world.setBounds(0, -20000, this.cameras.main.width, 40000);

        this.cursor = this.input.keyboard.createCursorKeys();
        this.cameras.main.startFollow(this.hero, false, 1, 0.05, 0, -2000);

        for (let i = 0; i < 3; i++) {
            this.cloudCreate(this.cameras.main.height - i * 200);
        }

        this.anims.create({
            key: 'left-stand',
            frames: [{ key: 'hero', frame: 1 }],
            frameRate: 10
        });
        
        this.anims.create({
            key: 'right-stand',
            frames: [{ key: 'hero', frame: 2 }],
            frameRate: 5
        });
        
        this.anims.create({
            key: 'left-walk',
            frames: [{ key: 'hero', frame: 0 }],
            frameRate: 5,
            repeat: -1
        });
        
        this.anims.create({
            key: 'right-walk',
            frames: [{ key: 'hero', frame: 3 }],
            frameRate: 5,
            repeat: -1
        });

        this.bgm = this.sound.add('bgm', { loop: true });
        this.jumpSound = this.sound.add('jump');
        this.collisionSound = this.sound.add('collision');
        this.bgm.setVolume(0.5);
        this.jumpSound.setVolume(0.7);
        this.collisionSound.setVolume(1); 

        this.connectSocket();
        
    }

    connectSocket() {
        this.socket = io.connect('http://localhost:3000');

        this.socket.on('playerData', (data) => {
           // Use the received data to update game elements
           this.otherPlayer.setPosition(data.x, data.y);
        });
    }

    update() {
        this.cameras.main.setBounds(0, -this.hero.yChange, this.cameras.main.width, this.cameras.main.height + this.hero.yChange);

        this.cameraYMin = Math.min(this.cameraYMin, this.hero.y - this.cameras.main.height + 130);
        this.cameras.main.scrollY = this.cameraYMin;

        if (this.cursor.left.isDown) {
            this.hero.body.setVelocityX(-250);
            this.hero.anims.play('left-walk', true);
            this.lastDirection = 'left'; // 注意这里的变化
            socket.emit('playerMove', { id: socket.id, x: this.hero.x, y: this.hero.y, direction: 'left' }); // Emit the player's movement data to the server
        } else if (this.cursor.right.isDown) {
            this.hero.body.setVelocityX(250);
            this.hero.anims.play('right-walk', true);
            this.lastDirection = 'right'; // 注意这里的变化
            socket.emit('playerMove', { id: socket.id, x: this.hero.x, y: this.hero.y, direction: 'right' }); // Emit the player's movement data to the server
        } else {
            this.hero.body.setVelocityX(0);
            if (this.lastDirection === 'left') { // 注意这里的变化
                this.hero.anims.play('left-stand');
            } else {
                this.hero.anims.play('right-stand');
            }
        }
        

        if (this.cursor.up.isDown && this.hero.body.touching.down) {
            this.hero.body.setVelocityY(-400);
        }

        this.physics.world.wrap(this.hero, 20);

        this.hero.yChange = Math.max(this.hero.yChange, Math.abs(this.hero.y - this.hero.yOrig));



        if (this.hero.y > this.cameras.main.scrollY + this.cameras.main.height) {
            this.bgm.stop();
            this.scene.restart();
        }

        
        
        // ADD BLOCKS
        let highestPlatform = this.cameras.main.height;
        this.platforms.getChildren().forEach(function(platform) {
            highestPlatform = Math.min(highestPlatform, platform.y);
        });
    
        if (highestPlatform > this.cameras.main.scrollY + 200) {
            let x;
            let y;
            do {
                x = Phaser.Math.Between(0, this.cameras.main.width - 50);
                y = highestPlatform - Phaser.Math.Between(80, 130);
            } while (this.isOverlappingWithClouds(x, y));
            
            let platformType = 'platform' + Phaser.Math.Between(1, 5);
            let platform = this.platforms.create(x, y, platformType);
            platform.setScale(0.07).refreshBody();
        }

        this.platforms.getChildren().forEach(platform => {
            if (platform.y > this.cameras.main.height) {
                platform.destroy();
            }
        });
        
             

        //CLOUDS
        if (this.cameras.main.scrollY < this.lastCloudY - 120) {
            this.cloudCreate(this.lastCloudY - 120);
            this.lastCloudY -= 120;
        }

        //MUSIC
        // 播放背景音乐
        if ((this.cursor.left.isDown || this.cursor.right.isDown || this.cursor.up.isDown) && !this.bgm.isPlaying) {
            this.bgm.play();
        }

        // 播放跳跃音效
        if (this.cursor.up.isDown && this.hero.body.touching.down) {
            this.jumpSound.play();
        }

        // 播放碰撞音效
        if (this.hero.body.touching.down && !this.heroWasTouchingDown) {
            this.collisionSound.play();
        }
        this.heroWasTouchingDown = this.hero.body.touching.down;

        this.socket.emit('playerMove', { x: this.hero.x, y: this.hero.y });
    }

    platformsCreate() {
        this.platforms = this.physics.add.staticGroup();
    
        let bottomPlatformType = 'platform' + Phaser.Math.Between(1, 4);
        let bottomPlatform = this.platforms.create(this.cameras.main.width / 2, this.cameras.main.height - 8, bottomPlatformType);
        bottomPlatform.setScale(0.15).refreshBody();
    
        for (let i = 0; i < 9; i++) {
            let x = Phaser.Math.Between(0, this.cameras.main.width - 50);
            let y = this.cameras.main.height - 100 - 100 * i;
            let platformType = 'platform' + Phaser.Math.Between(1, 5);
            let platform = this.platforms.create(x, y, platformType);
            platform.setScale(0.07).refreshBody();
            
        }
    }
    

    heroCreate() {
        this.hero = this.add.sprite(this.cameras.main.centerX, this.cameras.main.height - 36, 'hero');
        this.hero.setOrigin(0.5);
        this.hero.setScale(0.13);

        this.hero.yOrig = this.hero.y;
        this.hero.yChange = 0;

        this.physics.add.existing(this.hero);
        this.hero.body.setGravityY(500);
        this.hero.body.checkCollision.up = false;
        this.hero.body.checkCollision.left = false;
        this.hero.body.checkCollision.right = false;
    }
}

let config = {
    type: Phaser.CANVAS,
    width: 300,  // 根据需要调整
    height: 500,  // 根据需要调整
    parent: 'game-container',  // 指定父容器
    scene: [PlayScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 100 }
        }
    }
};

let game = new Phaser.Game(config);

