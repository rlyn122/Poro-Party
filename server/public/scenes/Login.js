class Login extends Phaser.Scene {

    constructor(){
        super("Login");
    }

    //pass the socket to the Login as well
    init(data){
        this.socket = data.socket;
    }

    preload(){
        this.load.html('codeform', "assets/codeform.html");
        this.load.image('title', "assets/letters/title.png")
    }  

    create() {
        const scene = this;
    
        scene.popUp = scene.add.graphics();
        scene.boxes = scene.add.graphics();
    
        // for popup window
        scene.popUp.lineStyle(5, 0xffffff);
        scene.popUp.fillStyle(0xffffff, 0.5);
    
        // for boxes
        scene.boxes.lineStyle(1, 0xffffff);
        scene.boxes.fillStyle(0xa9a9a9, 1);
    
        // popup window
        scene.popUp.strokeRect(25, 25, 750, 500);
        scene.popUp.fillRect(25, 25, 750, 500);
    
        //title
        scene.titleImage = scene.add.image(190, 60, 'title').setOrigin(0, 0).setScale(0.3);

        scene.JoinRoomButton = scene.add.text(230, 150, "Enter Username and Select a Cat!", {
          fill: "#000000",
          fontFamily: 'Bangers',
          fontSize:'24px',
          fontStyle: "bold",
        });
        
        scene.inputElement = this.add.dom(300, 250).createFromCache("codeform");


        const form = document.getElementById('roomForm');

        //once submit button is clicked get data and ask server if the key is valid
        form.addEventListener('submit',function(event){
          event.preventDefault(); //prevent default form submission
          const usernameInput = scene.inputElement.node.querySelector('input[name="user-name"]');
          const catInput = document.querySelector('input[name="cats"]:checked');

          //if these values exist, save the data into data object and emit isKeyValid event
          if (usernameInput && catInput) {
            const username = usernameInput.value;
            const cat = catInput.value;
          
          if (username&&cat){
            const data = {
              username:username, 
              cat: cat}; 
            scene.socket.emit("isKeyValid", data);
          }
        }
        })
        
        //empty text
        scene.notValidText = scene.add.text(562, 295, "", {
          fill: "#ff0000",
          fontSize: "15px",
          fontStyle: "bold"
        });
        
        //display that invalid text
        scene.socket.on("KeyNotValid", function (data) {
          scene.notValidText.setText(`Username Taken, Please Try Again: ${data.username}`);
        });

        //if key is valid, emit joinRoom and exit the waiting room
        scene.socket.on("KeyisValid",  (input) => {
          scene.socket.emit("joinRoom", input);
          scene.scene.stop("Login");
        });

      
      }
}