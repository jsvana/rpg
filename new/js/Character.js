var Character = function(name) {
  this.name = name || 'Steve';

  this.hp = 100;
  this.maxHP = 100;

  this.mp = 100;
  this.maxMP = 100;

  this.position = { x: 0, y: 0, mapX: 0, mapY: 0 };
  this.dimensions = { width: 20, height: 20, mapWidth: 0, mapHeight: 0 };
  this.tweens = { x: 0, y: 0 };

  this.satchel = new Satchel();

  this.initialize = function() {
  };

  this.render = function(gameContext, miniMapContext) {
    gameContext.save();
    miniMapContext.save();

    var x = this.position.x * this.dimensions.width + this.dimensions.width / 2;
    var y = this.position.y * this.dimensions.height + this.dimensions.height / 2;
    var radius = this.dimensions.width / 2;

    gameContext.strokeStyle = '#000000';
    gameContext.fillStyle = '#000000';
    miniMapContext.strokeStyle = '#000000';
    miniMapContext.fillStyle = '#000000';

    gameContext.beginPath();
    gameContext.arc(x, y, radius - 1, 0, 2 * Math.PI, false);
    gameContext.fill();
    gameContext.stroke();
    gameContext.closePath();

    miniMapContext.beginPath();
    miniMapContext.arc((this.position.mapX * this.dimensions.mapWidth * this.dimensions.width + x) / 4,
      (this.position.mapY * this.dimensions.mapHeight * this.dimensions.height + y) / 4,
      radius / 4 - 1, 0, 2 * Math.PI, false);
    miniMapContext.fill();
    miniMapContext.stroke();
    miniMapContext.closePath();

    gameContext.restore();
    miniMapContext.restore();
  };

  this.setMapPosition = function(position) {
    this.position.mapX = position.x;
    this.position.mapY = position.y;
  };

  this.setMapDimensions = function(dimensions) {
    this.dimensions.mapWidth = dimensions.width;
    this.dimensions.mapHeight = dimensions.height;
  };

  this.addItem = function(item) {
    this.satchel.addItem(item);
  };

  this.useItem = function(index) {
    return this.satchel.useItem(index, this);
  };

  this.getItems = function() {
    return this.satchel.getItems();
  };

  this.heal = function(value) {
    this.hp += value;

    if (this.hp > this.maxHP) {
      this.hp = this.maxHP;
    }
  };

  this.tween = function(direction) {
    if (this.tweens.x === 0 && this.tweens.y === 0) {
      switch (direction) {
        case Direction.up:
          this.tweens.y = this.dimensions.height;
          break;
        case Direction.down:
          this.tweens.y = -this.dimensions.height;
          break;
        case Direction.left:
          this.tweens.x = this.dimensions.width;
          break;
        case Direction.right:
          this.tweens.x = -this.dimensions.width;
          break;
      }

      return true;
    } else {

    }
  };
};
