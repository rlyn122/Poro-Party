class Rules_Volleyball extends Phaser.Scene {

    constructor(){
        super("Rules_Volleyball");
    }

    create() {
      const scene = this;

      scene.scene.pause("Volleyball");

      scene.popUp = scene.add.graphics();
      scene.boxes = scene.add.graphics();

      // for popup window
      scene.popUp.lineStyle(5, 0xffffff);
      scene.popUp.fillStyle(0xffff00, 0.5);
  
      // for boxes
      scene.boxes.lineStyle(1, 0xffffff);
      scene.boxes.fillStyle(0xffff00, 1);
  
      // popup window
      scene.popUp.strokeRect(25, 25, 750, 500);
      scene.popUp.fillRect(25, 25, 750, 500); 

      // Display the rules of the dodgeball game
      const rulesText = scene.add.text(140, 110, "Volleyball Game Rules:", {
          fill: "#000000",
          fontFamily: 'Arial',
          fontSize: "48px",
          fontStyle: "bold",
      });

      const rules = [
          "Bump the ball back and forth and be quick.",
          "The ball will reset right away to whoever won the point.",
          "The first team to 5 points wins!"
      ];

      // Display the rules as a list
      const rulesList = scene.add.text(180, 185, rules, {
          fill: "#000000",
          fontFamily: 'Arial',
          fontSize: "16px",
      });

      // Create a timer to auto-close the rules after 10 seconds
      const timerText = scene.add.text(230, 350, "The game will start in:", {
          fill: "#000000",
          fontFamily: 'Arial',
          fontSize: "22px",
      });

      let countdown = 10; // 10 seconds
      const timerInterval = setInterval(() => {
          countdown--;
          timerText.setText(`The game will start in: ${countdown} seconds`);
          
          if (countdown === 0) {
              clearInterval(timerInterval);
              scene.scene.stop("Rules_Volleyball"); // Close the popup after 10 seconds

              // Emit an event to notify that the scene is done
              scene.events.emit("RulesVolleyballDone");

              console.log('ALL DONE');

              scene.scene.resume("Volleyball");
          }
      }, 1000);
  }
}