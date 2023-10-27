import Phaser from "phaser";

export default class Login extends Phaser.Scene {

    loginhtml = 
     <div class="container" style="width: 200px; height: 100px;">
        <form>
          <input
            type="text"
            id="code-form-id"
            name="code-form"
            placeholder="enter room key"
          />
          <button type="button" id="enterRoom-id" name="enterRoom">enter</button>
        </form>
      </div>
      ;

    constructor(){
        super("Login");
        this.state = {};
        this.hasBeenSet = false;
    }

    //pass the socket to the Login as well
    init(data){
        this.socket = data.socket;
    }

    preload(){
        this.load.html('codeform', "assets/text/codeform.html");
        this.cache.html.add('codeform',htmlLogin)
    }  

    create() {
        const scene = this;
    
        scene.popUp = scene.add.graphics();
        scene.boxes = scene.add.graphics();
    
        // for popup window
        scene.popUp.lineStyle(1, 0xffffff);
        scene.popUp.fillStyle(0xffffff, 0.5);
    
        // for boxes
        scene.boxes.lineStyle(1, 0xffffff);
        scene.boxes.fillStyle(0xa9a9a9, 1);
    
        // popup window
        scene.popUp.strokeRect(25, 25, 750, 500);
        scene.popUp.fillRect(25, 25, 750, 500);
    
        //title
        scene.title = scene.add.text(100, 75, "Poro Party!", {
          fill: "#add8e6",
          fontSize: "66px",
          fontStyle: "bold",
        });
    
        //left popup
        scene.boxes.strokeRect(100, 200, 275, 100);
        scene.boxes.fillRect(100, 200, 275, 100);
        scene.requestButton = scene.add.text(140, 215, "Request Room Key", {
          fill: "#000000",
          fontSize: "20px",
          fontStyle: "bold",
        });
    
        //right popup
        scene.boxes.strokeRect(425, 200, 275, 100);
        scene.boxes.fillRect(425, 200, 275, 100);
        scene.inputElement = scene.add.dom(562.5, 250).createFromCache("codeform");
        scene.inputElement.setDisplaySize(200, 100);
        scene.inputElement.setPosition(0, 0);

        console.log(scene.inputElement)
        /*
        scene.inputElement.addListener("click");
        scene.inputElement.on("click", function (event) {
          if (event.target.name === "enterRoom") {
            const input = scene.inputElement.getChildByName("code-form");
            scene.socket.emit("isKeyValid", input.value);
          }
        });
    
        scene.requestButton.setInteractive();
        scene.requestButton.on("pointerdown", () => {
          scene.socket.emit("getRoomCode");
        });
    
        scene.notValidText = scene.add.text(670, 295, "", {
          fill: "#ff0000",
          fontSize: "15px",
        });
        scene.roomKeyText = scene.add.text(210, 250, "", {
          fill: "#00ff00",
          fontSize: "20px",
          fontStyle: "bold",
        });
    
        scene.socket.on("roomCreated", function (roomKey) {
          scene.roomKey = roomKey;
          scene.roomKeyText.setText(scene.roomKey);
        });
    
        scene.socket.on("KeyNotValid", function () {
          scene.notValidText.setText("Invalid Room Key");
        });
        scene.socket.on("keyIsValid", function (input) {
          scene.socket.emit("joinRoom", input);
          scene.scene.stop("WaitingRoom");
        });

        **/
      }
}