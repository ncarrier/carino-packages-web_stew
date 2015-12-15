/* modifying only width will keep the ratio */
var width = 854;
var height = (width * 480) / 854;
var fullScreenButton;
var dim = width / 3;
var game = new Phaser.Game(width, height, Phaser.AUTO, null, {
  preload: preload, create: create, update: update
});
var controlLeft;
var controlRight;
var textStyle = { font: '18px Arial', fill: '#0095DD' };
var debugText;

function preload()
{
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = '#f2fffb';
  game.load.spritesheet('button', 'img/fullscreen.png', 120, 40);
  /* disable pinch to zoom */
  window.ontouchstart = function(e){
    e.preventDefault();
    e.stopPropagation();
  }
}

function gofull()
{
  if (game.scale.isFullScreen)
    game.scale.stopFullScreen();
  else
    game.scale.startFullScreen(false);
}

function create()
{
  var top = (height - dim) / 2;
  var firstLeft = ((width / 2) - dim) / 2;
  var secondLeft = firstLeft + (width / 2);

  game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

  startButton = game.add.button(game.world.width * 0.5, game.world.height * 0.5,
    'button', gofull, this, 1, 0, 2);
  startButton.anchor.set(0.5);
  debugTextLeft = game.add.text(5, 5, "plop");
  debugTextRight = game.add.text(width / 2 + 5, 5, "plop");

  controlLeft = new Control(game, width / 4, height / 2, dim);
  controlRight = new Control(game, (3 * width) / 4, height / 2, dim);
}

function draw()
{
  var pos;

  controlLeft.draw();
  controlRight.draw();
  pos = controlLeft.get();
  debugTextLeft.setText(pos[0] + ", " + pos[1]);
  pos = controlRight.get();
  debugTextRight.setText(pos[0] + ", " + pos[1]);
}

function updateControls(pointer)
{
  if (controlLeft.isIn(pointer.x, pointer.y)) {
    controlLeft.set(pointer.x, pointer.y);
  }
  if (controlRight.isIn(pointer.x, pointer.y)) {
    controlRight.set(pointer.x, pointer.y);
  }
}

function update()
{
  updateControls(game.input.pointer1);
  updateControls(game.input.pointer2);
  draw();
}

