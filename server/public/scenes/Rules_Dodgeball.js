class Rules_Dodgeball extends Phaser.Scene {

    constructor(){
        super("Rules_Dodgeball");
    }

    create() {
      const scene = this;

      scene.scene.pause("Volleyball")

      // Display the rules of the volleyball game
      const rulesText = scene.add.text(50, 50, "Dodgeball Game Rules:", {
          fill: "#ffffff",
          fontFamily: 'Arial',
          fontSize: "24px",
          fontStyle: "bold",
      });

      const rules = [
          "Avoid the bouncing three planets and be the last cat standing!"
      ];

      // Display the rules as a list
      const rulesList = scene.add.text(50, 100, rules, {
          fill: "#ffffff",
          fontFamily: 'Arial',
          fontSize: "16px",
      });

      // Create a timer to auto-close the rules after 10 seconds
      const timerText = scene.add.text(50, 350, "The game will start in:", {
          fill: "#ffffff",
          fontFamily: 'Arial',
          fontSize: "18px",
      });

      let countdown = 10; // 10 seconds
      const timerInterval = setInterval(() => {
          countdown--;
          timerText.setText(`The game will start in: ${countdown} seconds`);
          
          if (countdown === 0) {
              clearInterval(timerInterval);
              scene.scene.stop("Rules_Dodgeball"); // Close the popup after 10 seconds
              // Emit an event to notify that the scene is done
              scene.events.emit("RulesDodgeballDone");
              scene.scene.resume("Volleyball")
          }
      }, 1000);
  }
}