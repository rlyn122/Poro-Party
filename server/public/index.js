var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: [Soccer, Volleyball, Dodgeball, MainScene, Login, Loading, Rules_Dodgeball, Rules_Volleyball, Rules_Soccer],
    dom: {
        createContainer: true,
    },
  };

window.onload = function(){
    window.game = new Phaser.Game(config);
};  