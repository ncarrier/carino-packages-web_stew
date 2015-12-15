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

var incrementLeftX = 10;
var incrementLeftY = 10;
var incrementRightX = 10;
var incrementRightY = 10;

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
  var spaceKey;

  game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

  startButton = game.add.button(game.world.width * 0.5, game.world.height * 0.5,
    'button', gofull, this, 1, 0, 2);
  startButton.anchor.set(0.5);

  controlLeft = new Control(game, width / 4, height / 2, dim);
  controlRight = new Control(game, (3 * width) / 4, height / 2, dim);

  // TODO these are dvorak programmer controls
  // left control
  game.input.keyboard.addKey(Phaser.Keyboard.PERIOD);
  game.input.keyboard.addKey(Phaser.Keyboard.O);
  game.input.keyboard.addKey(Phaser.Keyboard.E);
  game.input.keyboard.addKey(Phaser.Keyboard.U);

  // left control
  game.input.keyboard.addKey(Phaser.Keyboard.C);
  game.input.keyboard.addKey(Phaser.Keyboard.H);
  game.input.keyboard.addKey(Phaser.Keyboard.T);
  game.input.keyboard.addKey(Phaser.Keyboard.N);

  // for centering both
  spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  spaceKey.onDown.add(center, this);
}

function center()
{
  controlLeft.center();
  controlRight.center();
}

function draw()
{
  controlLeft.draw();
  controlRight.draw();
}

function updateControlsTouch(pointer)
{
  if (controlLeft.isIn(pointer.x, pointer.y)) {
    controlLeft.set(pointer.x, pointer.y);
  }
  if (controlRight.isIn(pointer.x, pointer.y)) {
    controlRight.set(pointer.x, pointer.y);
  }
}

function updateControlsKeyboard()
{
  var control;

  control = controlLeft;
  if (game.input.keyboard.isDown(Phaser.KeyCode.E))
    control.incrementY(incrementLeftY);
  if (game.input.keyboard.isDown(Phaser.KeyCode.PERIOD))
    control.incrementY(-incrementLeftY);
  if (game.input.keyboard.isDown(Phaser.KeyCode.U))
    control.incrementX(incrementLeftX);
  if (game.input.keyboard.isDown(Phaser.KeyCode.O))
    control.incrementX(-incrementLeftX);

  control = controlRight;
  if (game.input.keyboard.isDown(Phaser.KeyCode.T))
    control.incrementY(incrementLeftY);
  if (game.input.keyboard.isDown(Phaser.KeyCode.C))
    control.incrementY(-incrementLeftY);
  if (game.input.keyboard.isDown(Phaser.KeyCode.N))
    control.incrementX(incrementLeftX);
  if (game.input.keyboard.isDown(Phaser.KeyCode.H))
    control.incrementX(-incrementLeftX);
}

function handleInput()
{
  updateControlsTouch(game.input.pointer1);
  updateControlsTouch(game.input.pointer2);
  updateControlsKeyboard();
}

function update()
{
  handleInput();
  draw();
}

