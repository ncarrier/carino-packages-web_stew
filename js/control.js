function Control(game, centerX, centerY, dim) {
  this.game = game;
  this.centerX = centerX;
  this.centerY = centerY;
  this.x = centerX;
  this.y = centerY;
  this.dim = dim;
  this.hd = dim / 2;
  this.radius = this.dim / 5;
  this.graphics = this.game.add.graphics(0, 0);
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
  this.x = clip(x, this.centerX, this.hd);
  this.y = clip(y, this.centerY, this.hd);
}
