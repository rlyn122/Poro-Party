
/** @type {import("../typings/phaser")} */
//bring in the scenes
import "phaser";
import config from "./config/config.js";
import Lobby from "./scenes/Lobby.js";
import MainScene from "./scenes/MainScene.js";


class Game extends Phaser.Game {
    constructor(){
        //add config file to game
        super(config);

        //TODO: add scenes here
        this.scene.add("MainScene",MainScene);
        this.scene.add("Lobby",Lobby);

        // start game in main scene
        this.scene.start("MainScene");
    }
}

window.onload = function(){
    window.game = new Game();
};