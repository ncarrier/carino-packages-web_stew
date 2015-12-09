  var game = new Phaser.Game(480, 320, Phaser.AUTO, null, {
    preload: preload, create: create, update: update
  });
  function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.stage.backgroundColor = '#eee';
  }
  function create() {}
  function update() {}

