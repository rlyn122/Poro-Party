const config = {
    type: Phaser.HEADLESS,
    parent: 'game',
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
        gravity: { y: 400 }
      }
    },
    scene: [Volleyball,Login,MainScene],
    autoFocus: false
  };


const game = new Phaser.Game(config);
window.gameLoaded();