var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: [Volleyball, MainScene, Login, Loading, Rules_Dodgeball],
    dom: {
        createContainer: true,
    },
  };

window.onload = function(){
    window.game = new Phaser.Game(config);
};