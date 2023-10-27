//bring in the scenes
import "phaser";
import config from "./config/config.js";
import Login from "./scenes/Login.js";
import MainScene from "./scenes/MainScene.js";
import Test from "./scenes/Test.js";


class Game extends Phaser.Game {
    constructor(){
        //add config file to game
        super(config);

        //TODO: add scenes here 
        this.scene.add("MainScene",MainScene);
        this.scene.add("Login",Login);
        this.scene.add("Test",Test)
        

        // start game in main scene
        this.scene.start("Test");
    }
}

window.onload = function(){
    window.game = new Game();
};