/* modifying only width will keep the ratio */
var width = 854;
var height = (width * 480) / 854;
var fullScreenButton;

var game = new Phaser.Game(width, height, Phaser.AUTO, null, {
  preload: preload, create: create, update: update
});
function preload()
{
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = '#d6e3df';
  game.load.spritesheet('button', 'img/fullscreen.png', 120, 40);
}

function gofull()
{
  if (game.scale.isFullScreen)
    game.scale.stopFullScreen();
  else
    game.scale.startFullScreen(false);
}

function create() {
  var graphics = game.add.graphics(0, 0);
  var dim = width / 3;
  var top = (height - dim) / 2;
  var firstLeft = ((width / 2) - dim) / 2;
  var secondLeft = firstLeft + (width / 2);

  graphics.lineStyle(2, 0x0000FF, 1);
  graphics.beginFill(0xFFFF0B, 0.5);
  graphics.drawRect(firstLeft, top, dim, dim);
  graphics.drawRect(secondLeft, top, dim, dim);
  graphics.endFill();

  window.graphics = graphics;
  game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

  startButton = game.add.button(game.world.width * 0.5, game.world.height * 0.5,
    'button', gofull, this, 1, 0, 2);
  startButton.anchor.set(0.5);
}

function update()
{

}

