import Phaser from "phaser";

export default class Login extends Phaser.Scene {

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
          fill: "#E75480",
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
        scene.JoinRoomButton = scene.add.text(465, 215, "Join Room", {
          fill: "#000000",
          fontSize: "20px",
          fontStyle: "bold",
        });

        scene.inputElement = scene.add.dom(562.5, 250).createFromCache("codeform");


        const form = document.getElementById('roomForm');

        form.addEventListener('submit',function(event){
          event.preventDefault(); //prevent default form submission
          const usernameInput = scene.inputElement.node.querySelector('input[name="user-name"]');
          const codeInput = scene.inputElement.node.querySelector('input[name="code-form"]');
          const catInput = document.querySelector('input[name="cats"]:checked');
          
          //if these values exist, save the data into data object and emit isKeyValid event
          if (usernameInput && codeInput && catInput) {
            const username = usernameInput.value;
            const key = codeInput.value;
            const cat = catInput.value;
          
          if (username && key){
            const data = {
              username:username, 
              key: key, 
              cat: cat}; 
            scene.socket.emit("isKeyValid", data);
          }
          else{
            console.log("Please put in room key and username")
          }
        }
        })

    
        scene.requestButton.setInteractive();
        scene.requestButton.on("pointerdown", () => {
          scene.socket.emit("getRoomCode");
        });
    
        
        scene.notValidText = scene.add.text(562, 295, "", {
          fill: "#ff0000",
          fontSize: "15px",
          fontStyle: "bold"
        });

        //place to display roomKey text
        scene.roomKeyText = scene.add.text(210, 250, "", {
          fill: "#00ff00",
          fontSize: "20px",
          fontStyle: "bold"
        });
        
        //recieved room code from server
        scene.socket.on("roomCreated", function (roomKey) {
          scene.roomKey = roomKey;
          scene.roomKeyText.setText(scene.roomKey);
        });
    
        scene.socket.on("KeyNotValid", function (data) {
          scene.notValidText.setText(`Invalid Room Key: ${data.key}`);
        });

        //if key is valid, emit joinRoom and exit the waiting room
        scene.socket.on("KeyisValid",  (input) => {
          scene.socket.emit("joinRoom", input);
          scene.scene.stop("Login");
        });

      
      }
}