var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: [Volleyball,Login,MainScene],
    dom: {
        createContainer: true,
    },
  };

  class Game extends Phaser.Game {
    constructor(){
        super(config);
    }
}

window.onload = function(){
    window.game = new Game(config);
};