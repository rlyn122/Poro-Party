class Rules_Soccer extends Phaser.Scene {

    constructor(){
        super("Rules_Soccer");
    }

    create() {
      const scene = this;

      scene.scene.pause("Soccer");

      scene.popUp = scene.add.graphics();
      scene.boxes = scene.add.graphics();

      // for popup window
      scene.popUp.lineStyle(5, 0xffffff);
      scene.popUp.fillStyle(0x00ff59, 0.5);
  
      // for boxes
      scene.boxes.lineStyle(1, 0xffffff);
      scene.boxes.fillStyle(0x00ff59, 1);
  
      // popup window
      scene.popUp.strokeRect(25, 25, 750, 500);
      scene.popUp.fillRect(25, 25, 750, 500); 

      // Display the rules of the dodgeball game
      const rulesText = scene.add.text(140, 110, "Soccer Game Rules:", {
          fill: "#ffffff",
          fontFamily: 'Arial',
          fontSize: "48px",
          fontStyle: "bold",
      });

      const rules = [
          "Dribble the ball to the goal and score points.",
          "The ball will reset in the middle with each point.",
          "The first team to 5 points wins!"
      ];

      // Display the rules as a list
      const rulesList = scene.add.text(180, 185, rules, {
          fill: "#ffffff",
          fontFamily: 'Arial',
          fontSize: "16px",
      });

      // Create a timer to auto-close the rules after 10 seconds
      const timerText = scene.add.text(230, 350, "The game will start in:", {
          fill: "#ffffff",
          fontFamily: 'Arial',
          fontSize: "22px",
      });

      let countdown = 10; // 10 seconds
      const timerInterval = setInterval(() => {
          countdown--;
          timerText.setText(`The game will start in: ${countdown} seconds`);
          
          if (countdown === 0) {
              clearInterval(timerInterval);
              scene.scene.stop("Rules_Soccer"); // Close the popup after 10 seconds
              scene.scene.resume("Soccer");
          }
      }, 1000);
  }
}