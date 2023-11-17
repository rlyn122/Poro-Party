function addPlayer(self, playerInfo) {
    const player = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'hero'); // use 'hero' sprite
    player.playerId = playerInfo.playerId;
    self.players.add(player);
    player.setBounce(0.2);
    player.setScale(0.13); // Adjust scale to match your game
    player.setCollideWorldBounds(true);
  }
  
  function handlePlayerInput(self, playerId, input) {
    self.players.getChildren().forEach((player) => {
      if (playerId === player.playerId) {
        players[player.playerId].input = input;
        // Handle movement and jumping based on input
        if (input.left) {
          player.setVelocityX(-250);
        } else if (input.right) {
          player.setVelocityX(250);
        } else {
          player.setVelocityX(0);
        }
        if (input.up && player.body.touching.down) {
          player.setVelocityY(-400);
        }
      }
    });
  }