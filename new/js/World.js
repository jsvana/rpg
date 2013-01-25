var World = function(assets) {
  this.tiles = [];
  this.location = {};
  this.dimensions = { mapWidth: 2, mapHeight: 2, width: 20, height: 20 };
  this.tileDimensions = { width: 32, height: 32 };
  this.viewportDimensions = { width: 10, height: 10 };
  this.currentMap = { x: 0, y: 0 };
  this.layers = 2;
  this.mapTween = { x: 0, y: 0 };
  this.assets = assets;

  this.initialize = function() {
    var x = 0;
    var y = 0;

    for (var i = 0; i < map.length / this.layers; i++) {
      if (i !== 0 && i % (this.dimensions.width * this.dimensions.mapWidth) === 0) {
        x = 0;
        ++y;
      } else if (i !== 0) {
        ++x;
      }

      if (this.tiles[y] === undefined) {
        this.tiles[y] = [];
      }

      var layerTiles = [];

      for (var j = 0; j < this.layers; j++) {
        layerTiles[j] = map[i + j * this.dimensions.width * this.dimensions.height * this.dimensions.mapHeight * this.dimensions.mapWidth + 1];
      }

      this.tiles[y].push(new Tile(layerTiles, this.assets));
    }

    console.log(this.tiles);
  };

  this.render = function(context, assets) {
    var mapX = this.currentMap.x;
    var mapY = this.currentMap.y;
    var xMin = mapX * this.viewportDimensions.width;
    var yMin = mapY * this.viewportDimensions.height;
    var xMax = this.viewportDimensions.width + xMin;
    var yMax = this.viewportDimensions.height + yMin;
    var inverse = false;

    for (var y = yMin; y < yMax; y++) {
      for (var x = xMin; x < xMax; x++) {
        this.tiles[y][x].render(context, (x - xMin) * this.tileDimensions.width, (y - yMin) * this.tileDimensions.height);
      }
    }
  };

  this.move = function(character, direction, magnitude) {
    var currentX = character.position.x + this.currentMap.x * this.dimensions.width;
    var currentY = character.position.y + this.currentMap.y * this.dimensions.height;

    switch (direction) {
      case Direction.up:
        if (character.position.y - magnitude < 0
          && this.currentMap.y > 0) {
          --this.currentMap.y;
          character.position.y = this.viewportDimensions.height - 1;
        } else if (character.position.y - magnitude >= 0
          && this.tiles[currentY - magnitude][currentX].walkable) {
          --character.position.y;
          character.tween(direction);
        }
        break;
      case Direction.down:
        if (character.position.y + magnitude >= this.viewportDimensions.height
          && this.currentMap.y < this.dimensions.mapHeight - 1) {
          ++this.currentMap.y;
          character.position.y = 0;
        } else if (character.position.y + magnitude < this.viewportDimensions.height
          && this.tiles[currentY + magnitude][currentX].walkable) {
          ++character.position.y;
          character.tween(direction);
        }
        break;
      case Direction.left:
        if (character.position.x - magnitude < 0
          && this.currentMap.x > 0) {
          --this.currentMap.x;
          character.position.x = this.viewportDimensions.width - 1;
        } else if (character.position.x - magnitude >= 0
          && this.tiles[currentY][currentX - magnitude].walkable) {
          --character.position.x;
          character.tween(direction);
          console.log('[LOG] move left, x: ' + character.position.x);
        }
        break;
      case Direction.right:
        if (character.position.x + magnitude >= this.viewportDimensions.width
          && this.currentMap.x < this.dimensions.mapWidth - 1) {
          ++this.currentMap.x;
          character.position.x = 0;
        } else if (character.position.x + magnitude < this.viewportDimensions.width
          && this.tiles[currentY][currentX + magnitude].walkable) {
          ++character.position.x;
          character.tween(direction);
          console.log('[LOG] move right, x: ' + character.position.x);
        }
        break;
    }
  };

  this.getMapDimensions = function() {
    return { width: this.dimensions.width, height: this.dimensions.height };
  };

  this.switchMaps = function(x, y) {
    if (x >= 0 && x < this.dimensions.mapWidth && y >= 0 && y < this.dimensions.mapHeight) {
      this.currentMap = { x: x, y: y };
      return true;
    } else {
      return false;
    }
  };

  this.transitionMaps = function(direction) {
    switch (direction) {
      case Direction.up:
        this.mapTween.y = -this.dimensions.height;
        return this.switchMaps(this.currentMap.x, this.currentMap.y - 1);
        break;
      case Direction.down:
        this.mapTween.y = this.dimensions.height;
        return this.switchMaps(this.currentMap.x, this.currentMap.y + 1);
        break;
      case Direction.left:
        this.mapTween.x = -this.dimensions.width;
        return this.switchMaps(this.currentMap.x - 1, this.currentMap.y);
        break;
      case Direction.right:
        this.mapTween.x = this.dimensions.width;
        return this.switchMaps(this.currentMap.x + 1, this.currentMap.y);
        break;
    }
  };

  this.isTweening = function() {
    return this.mapTween.x !== 0 || this.mapTween.y !== 0;
  };

  this.tweenMaps = function() {
    if (this.mapTween.x > 0) {
      --this.mapTween.x;
    } else if (this.mapTween.x < 0) {
      ++this.mapTween.x;
    }

    if (this.mapTween.y > 0) {
      --this.mapTween.y;
    } else if (this.mapTween.y < 0) {
      ++this.mapTween.y;
    }
  };
};
