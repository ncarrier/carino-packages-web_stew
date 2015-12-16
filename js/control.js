function Control(game, centerX, centerY, dim) {
  this.game = game;
  this.centerX = centerX;
  this.centerY = centerY;
  this.dim = dim;
  this.hd = dim / 2;
  this.radius = this.dim / 5;
  this.graphics = this.game.add.graphics(0, 0);
  this.set(centerX, centerY);
}

Control.prototype.isIn = function(x, y) {
  var offX = x - this.centerX;
  var offY = y - this.centerY;
  var bound = dim / 2;

  return offX < bound && offX > -bound &&
    offY < bound && offY > -bound;
};

Control.prototype.draw = function() {
  this.graphics.clear();
  this.graphics.lineStyle(2, 0x000088, 1);

  this.graphics.beginFill(0xeeeeee, 0.5);
  this.graphics.drawRect(this.centerX - this.hd, this.centerY - this.hd,
    this.dim, this.dim);
  this.graphics.endFill();

  this.graphics.lineStyle(2, 0xf9ffd8, 1);
  this.graphics.beginFill(0xf9ffd8, 0.5);
  this.graphics.drawCircle(this.x, this.y, this.dim / 5);
  this.graphics.endFill();
}

function clip(val, center, halfSpan) {
  var ret;

  val = Math.max(val, center - halfSpan);
  val = Math.min(val, center + halfSpan);

  return val;
}

Control.prototype.set = function(x, y) {
  this.x = Math.trunc(clip(x, this.centerX, this.hd));
  this.y = Math.trunc(clip(y, this.centerY, this.hd));
}

Control.prototype.incrementX = function(delta) {
  this.set(this.x + delta, this.y);
}

Control.prototype.incrementY = function(delta) {
  this.set(this.x, this.y + delta);
}

function rescale(val, oldDown, oldUp, newDown, newUp)
{
  var inZeroOne = (val - oldDown) / (oldUp - oldDown);

  return Math.trunc(inZeroOne * (newUp - newDown) + newDown);
}

Control.prototype.getIn = function(down, up) {
  var newX;
  var newY;

  newX = rescale(this.x, this.centerX - this.hd, this.centerX + this.hd, down, up);
  newY = rescale(this.y, this.centerY - this.hd, this.centerY + this.hd, down, up);

  return [newX, newY];
}

Control.prototype.center = function()
{
  this.set(this.centerX, this.centerY);
}
