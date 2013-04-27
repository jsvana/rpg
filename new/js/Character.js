var Character = function(name, assets) {
  this.name = name || 'Steve';

  this.hp = 100;
  this.maxHP = 100;

  this.mp = 100;
  this.maxMP = 100;

  this.position = { x: 0, y: 0, mapX: 0, mapY: 0 };
  this.dimensions = { width: 32, height: 32, mapWidth: 0, mapHeight: 0 };
  this.tweens = { x: 0, y: 0 };
  this.direction = Direction.down;
  this.frame = 1;
  this.moving = false;
  this.assets = assets;

  this.satchel = new Satchel();

  this.initialize = function() {
  };

  this.render = function(gameContext) {
    gameContext.save();

    var x = this.position.x * this.dimensions.width + this.dimensions.width / 2 + this.tweens.x;
    var y = this.position.y * this.dimensions.height + this.dimensions.height / 2 + this.tweens.y;
    var radius = this.dimensions.width / 2;

    gameContext.strokeStyle = '#000000';
    gameContext.fillStyle = '#000000';

    gameContext.beginPath();
    gameContext.arc(x, y, radius - 1, 0, 2 * Math.PI, false);
    gameContext.fill();
    gameContext.stroke();
    gameContext.closePath();

    gameContext.restore();
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
    this.moving = true;

    if (direction) {
      this.direction = direction;
    }

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

    if (this.tweens.x > 0 && this.direction === Direction.left) {
      this.tweens.x = 0;
    }

    if (this.tweens.x > 0 && this.direction === Direction.right) {
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

    if (!this.isTweening()) {
      this.moving = false;
    }
  };
};
