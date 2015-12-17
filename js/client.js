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
//var debugText;
var socket;

var incrementLeftX = 10;
var incrementLeftY = 10;
var incrementRightX = 10;
var incrementRightY = 10;

var seqnum = 0;
var RCINPUT_UDP_NUM_CHANNELS = 8
var RCINPUT_UDP_VERSION = 2

var bufferSize = 4 /* version */ +
                 8 /* timestamp_us */ +
                 2 /* sequence */ +
                 RCINPUT_UDP_NUM_CHANNELS * 2 /* pwms */;

function preload()
{
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = '#f2fffb';
  game.load.spritesheet('fullscreen', 'img/fullscreen.png', 120, 40);
  game.load.spritesheet('center', 'img/center.png', 120, 40);
    /* disable pinch to zoom */
  window.ontouchstart = function(e){
    e.preventDefault();
    e.stopPropagation();
  }
//  debugText = game.add.text(5, 5, "plop");
  try {
    socket = new WebSocket("ws://10.10.10.1:54321", "protocol");
    setInterval(sendCommands, 10);
  } catch (err) {
    debugText.setText("not connected " + Date.now());
  }
}

function fullScreen()
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
  var centerButton;
  var fullScreenButton;
  var keys = Settings.keys;

  game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

  fullScreenButton = game.add.button(width / 2, height / 2, 'fullscreen',
    fullScreen, this, 1, 0, 2);
  fullScreenButton.anchor.set(0.5);
  centerButton = game.add.button(width / 2, game.world.height * 0.8, 'center',
    center, this, 1, 0, 2);
  centerButton.anchor.set(0.5);

  controlLeft = new Control(game, width / 4, height / 2, dim);
  controlRight = new Control(game, (3 * width) / 4, height / 2, dim);

  // TODO these are dvorak programmer controls
  game.input.keyboard.addKey(keys.roll.increase);
  game.input.keyboard.addKey(keys.roll.decrease);
  game.input.keyboard.addKey(keys.pitch.increase);
  game.input.keyboard.addKey(keys.pitch.decrease);
  game.input.keyboard.addKey(keys.throttle.increase);
  game.input.keyboard.addKey(keys.throttle.decrease);
  game.input.keyboard.addKey(keys.yaw.increase);
  game.input.keyboard.addKey(keys.yaw.decrease);

  // for centering both
  spaceKey = game.input.keyboard.addKey(keys.center);
  spaceKey.onDown.add(center, this);
}

function center()
{
  controlLeft.center();
  controlRight.center();
  // TODO remove ?
  game.input.pointer1.x = -1;
  game.input.pointer1.y = -1;
  game.input.pointer2.x = -1;
  game.input.pointer2.y = -1;
}

function draw()
{
  controlLeft.draw();
  controlRight.draw();
}

function updateControlsTouch(pointer)
{
  if (pointer.isUp)
    return;

  if (controlLeft.isIn(pointer.x, pointer.y))
    controlLeft.set(pointer.x, pointer.y);
  if (controlRight.isIn(pointer.x, pointer.y))
    controlRight.set(pointer.x, pointer.y);
}

function updateControlsKeyboard()
{
  var control;
  var keys = Settings.keys;

  control = controlLeft;
  if (game.input.keyboard.isDown(keys.throttle.decrease))
    control.incrementY(incrementLeftY);
  if (game.input.keyboard.isDown(keys.throttle.increase))
    control.incrementY(-incrementLeftY);
  if (game.input.keyboard.isDown(keys.yaw.increase))
    control.incrementX(incrementLeftX);
  if (game.input.keyboard.isDown(keys.yaw.decrease))
    control.incrementX(-incrementLeftX);

  control = controlRight;
  if (game.input.keyboard.isDown(keys.pitch.decrease))
    control.incrementY(incrementLeftY);
  if (game.input.keyboard.isDown(keys.pitch.increase))
    control.incrementY(-incrementLeftY);
  if (game.input.keyboard.isDown(keys.roll.increase))
    control.incrementX(incrementLeftX);
  if (game.input.keyboard.isDown(keys.roll.decrease))
    control.incrementX(-incrementLeftX);
}

function handleInput()
{
  updateControlsTouch(game.input.pointer1);
  updateControlsTouch(game.input.pointer2);
  updateControlsKeyboard();
}

function numberTo2bytes(number) {
  return [(number & 0xFF),
      (number & 0xFF00) >> 8]
}

function numberTo4bytes(number) {
  return [(number & 0xFF),
      (number & 0xFF00) >> 8,
      (number & 0xFF0000) >> 16,
      (number & 0xFF000000) >> 24]
}

function numberTo8bytes(number) {
  return [(number & 0xFF),
      (number & 0xFF00) >> 8,
      (number & 0xFF0000) >> 16,
      (number & 0xFF000000) >> 24,
      (number & 0xFF00000000) >> 32,
      (number & 0xFF0000000000) >> 40,
      (number & 0xFF000000000000) >> 48,
      (number & 0xFF00000000000000) >> 56]
}

function sendCommands()
{
  var posLeft;
  var channels;
  var buffer = new Uint8Array(bufferSize);
  var packet = buffer.buffer;
  var i;
  var array;
  var mode = 1165; // mode 1
  var offset;
  var ts = window.performance.now();

  posLeft = controlLeft.getIn(1100, 1900);
  posRight = controlRight.getIn(1100, 1900);
  channels = [posLeft[0], posLeft[1], posRight[0], posRight[1]];

  for (i = 0; i < bufferSize; i++)
    buffer[i] = 0;

  /* build the packet */
  /* version */
  offset = 0;
  array = numberTo4bytes(RCINPUT_UDP_VERSION);
  for (i = 0; i < 4; i++)
    buffer[i + offset] = array[i];
  offset += 4;
  /* timestamp_us  */
  array = numberTo8bytes(Math.trunc(ts * 1000));
  for (i = 0; i < 8; i++)
    buffer[i + offset] = array[i];
  offset += 8;
  /* seqnum */
  array = numberTo2bytes(seqnum++);
  for (i = 0; i < 2; i++)
    buffer[i + offset] = array[i];
  offset += 2;
  /* roll == pwm[0] */
  array = numberTo2bytes(posRight[0]);
  for (i = 0; i < 2; i++)
    buffer[i + offset] = array[i];
  offset += 2;
  /* pitch == pwm[1] */
  array = numberTo2bytes(posRight[1]);
  for (i = 0; i < 2; i++)
    buffer[i + offset] = array[i];
  offset += 2;
  /* throttle == pwm[2] */
  array = numberTo2bytes(posLeft[1]);
  for (i = 0; i < 2; i++)
    buffer[i + offset] = array[i];
  offset += 2;
  /* yaw == pwm[3] */
  array = numberTo2bytes(posLeft[0]);
  for (i = 0; i < 2; i++)
    buffer[i + offset] = array[i];
  offset += 2;
  /* mode == pwm[4] */
  array = numberTo2bytes(mode);
  for (i = 0; i < 2; i++)
    buffer[i + offset] = array[i];
  offset += 2;

  if (socket.readyState == WebSocket.OPEN) {
    socket.send(btoa(String.fromCharCode.apply(null, buffer)));
    console.log("send");
  }
}

function update()
{
  handleInput();
  draw();
}

