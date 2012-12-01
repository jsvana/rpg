var Character = function(name) {
  this.name = name || 'Steve';

  this.hp = 100;
  this.maxHP = 100;

  this.mp = 100;
  this.maxMP = 100;

  this.position = { x: 0, y: 0, mapX: 0, mapY: 0 };
  this.dimensions = { width: 32, height: 32, mapWidth: 0, mapHeight: 0 };
  this.tweens = { x: 0, y: 0 };
  this.direction = Direction.down;

  this.satchel = new Satchel();

  this.initialize = function() {
  };

  this.render = function(gameContext, miniMapContext) {
    gameContext.save();
    miniMapContext.save();

    var x = this.position.x * this.dimensions.width + this.dimensions.width / 2 + this.tweens.x;
    var y = this.position.y * this.dimensions.height + this.dimensions.height / 2 + this.tweens.y;
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

  this.isTweening = function() {
    return this.tweens.x !== 0 || this.tweens.y !== 0;
  };

  this.tween = function(direction) {
    this.direction = direction;

    if ((direction === Direction.left || direction === Direction.right) && this.tweens.x === 0) {
      if (direction === Direction.left) {
        this.tweens.x = this.dimensions.width;
      } else if (direction === Direction.right) {
        this.tweens.x = -this.dimensions.width;
      }
    }

    if ((direction === Direction.up || direction === Direction.down) && this.tweens.y === 0) {
      if (direction === Direction.up) {
        this.tweens.y = this.dimensions.height;
      } else if (direction === Direction.down) {
        this.tweens.y = -this.dimensions.height;
      }
    }

    if (this.tweens.x > 0) {
      this.tweens.x -= 4;
    } else if (this.tweens.x < 0) {
      this.tweens.x += 4;
    }

    if (this.tweens.x < 0 && this.direction === Direction.left
      || this.tweens.x > 0 && this.direction === Direction.right) {
      this.tweens.x = 0;
    }

    if (this.tweens.y > 0) {
      this.tweens.y -= 4;
    } else if (this.tweens.y < 0) {
      this.tweens.y += 4;
    }

    if (this.tweens.y < 0 && this.direction === Direction.up
      || this.tweens.y > 0 && this.direction === Direction.down) {
      this.tweens.y = 0;
    }
  };
};
