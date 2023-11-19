class Loading extends Phaser.Scene {

    constructor(){
        super("Loading");
    }

    preload(){
        this.load.spritesheet("cat4", "assets/cats/Cat_4.png", {frameWidth:250, frameHeight:184});
        this.load.image("bg","assets/bgload1.jpg");
        this.load.image("P","assets/letters/P.png")
        this.load.image("O","assets/letters/O.png")
        this.load.image("R","assets/letters/R.png")
        this.load.image("Y","assets/letters/Y.png")
        this.load.image("A","assets/letters/A.png")
        this.load.image("T","assets/letters/T.png")
    }

    create(){

        const scene = this
        this.add.image(0,0,"bg").setOrigin(0);
        var letterx = 200   
        var lettery = 50
        this.letters = this.add.group()
        this.letters.O = this.add.sprite(150+lettery,letterx,"O").setScale(0.35);
        this.letters.P = this.add.sprite(100+lettery,letterx,"P").setScale(0.35);
        this.letters.R = this.add.sprite(200+lettery,letterx,"R").setScale(0.35);
        this.letters.O1 = this.add.sprite(250+lettery,letterx,"O").setScale(0.35);

        this.letters.P1 = this.add.sprite(400+lettery,letterx,"P").setScale(0.35);
        this.letters.A = this.add.sprite(450+lettery,letterx,"A").setScale(0.35);
        this.letters.R = this.add.sprite(500+lettery,letterx,"R").setScale(0.35);
        this.letters.T = this.add.sprite(550+lettery,letterx,"T").setScale(0.35);
        this.letters.Y = this.add.sprite(610+lettery,letterx,"Y").setScale(0.35);
        this.LoadingText = scene.add.text(scene.cameras.main.centerX, scene.cameras.main.centerY, "Loading.", {
            fill: "#E75480",
            fontSize: "50px",
            fontStyle: "bold",
            fontFamily: '"Roboto", Arial, sans-serif', // Replace with your desired font family
            align: "center"
          }).setOrigin(0.5, 0.5); // This will center align the text
          
          // Add a shadow
          this.LoadingText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

        // Initialize a variable to keep track of dots
        let dots = '';

        // Create a timed event to update the text
        scene.time.addEvent({
            delay: 1000, // Delay in ms (500ms here)
            callback: () => {
                dots += '.';
                if (dots.length > 3) {
                    dots = '';
                }
                this.LoadingText.setText('Loading' + dots);
            },
            callbackScope: this,
            loop: true
        });
        
        let catSprite = scene.add.sprite(scene.cameras.main.centerX, scene.cameras.main.centerY+130, "cat4").setScale(0.5,0.5);
        // Create the walking animation
        scene.anims.create({
            key: 'walk',
            frames: scene.anims.generateFrameNumbers('cat4', { start: 0, end: 3 }), // Adjust frame numbers according to your spritesheet
            frameRate: 5,
            repeat: -1 // This will loop the animation
        });

        // Play the walking animation
        catSprite.anims.play('walk', true);  
        setTimeout(() => {
            this.scene.stop('Loading');
          }, 7500);

    }

    update(){

    }

}