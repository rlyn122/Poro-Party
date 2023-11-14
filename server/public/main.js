//bring in the scenes
import Login from "./js/Login.js";
import MainScene from "./js/MainScene.js"
import Volleyball from "./js/volleyball.js";

var config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  height: 600,
  scene: [Login,Volleyball]
}

class Game extends Phaser.Game{
  constructor(){
    
    super(config);
    this.scene.add("MainScene",MainScene);
    this.scene.add("Login",Login);
    this.scene.add("Volleyball", Volleyball)

    // start game in main scene
    this.scene.start("Login");
  }
}

window.onload = function(){
  window.game = new Game();
};