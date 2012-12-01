var World = function(assets) {
  this.tiles = [];
  this.location = {};
  this.dimensions = { mapWidth: 2, mapHeight: 2, width: 20, height: 20 };
  this.currentMap = { x: 0, y: 0 };
  this.mapTween = { x: 0, y: 0 };
  this.assets = assets;

  this.initialize = function() {
    for (var currentMapY = 0; currentMapY < this.dimensions.mapHeight; currentMapY++) {
      this.tiles.push([]);
      for (var currentMapX = 0; currentMapX < this.dimensions.mapWidth; currentMapX++) {
        this.tiles[currentMapY].push([]);
        for (var y = 0; y < this.dimensions.height; y++) {
          this.tiles[currentMapY][currentMapX].push([]);
          for (var x = 0; x < this.dimensions.width; x++) {
            var tileType = map[currentMapY][currentMapX][y][x];

            var newTile = new Tile(tileType,
              { mapX: currentMapX, mapY: currentMapY, x: x, y: y },
              { width: this.dimensions.width, height: this.dimensions.height },
              this.assets
            );
            this.tiles[currentMapY][currentMapX][y].push(newTile);
          }
        }
      }
    }
  };

  this.render = function(context, assets) {
    var xMin = 0;
    var yMin = 0;
    var xMax = this.dimensions.width;
    var yMax = this.dimensions.height;
    var mapX = this.currentMap.x;
    var mapY = this.currentMap.y;
    var inverse = false;

    if (this.mapTween.x > 0) {
      xMin = this.mapTween.x;
      xMax = this.mapTween.x;
      --mapX;
    } else if (this.mapTween.x < 0) {
      xMin = this.dimensions.width + this.mapTween.x;
      xMax = this.dimensions.width + this.mapTween.x;
      ++mapX;
      inverse = true;
    } else if (this.mapTween.y > 0) {
      yMin = this.mapTween.y;
      yMax = this.mapTween.y;
      --mapY;
    } else if (this.mapTween.y < 0) {
      yMin = this.dimensions.height + this.mapTween.y;
      yMax = this.dimensions.height + this.mapTween.y;
      ++mapY;
      inverse = true;
    }

    if (inverse) {
      for (var y = 0; y < yMax; y++) {
        for (var x = 0; x < xMax; x++) {
          this.tiles[this.currentMap.y][this.currentMap.x][y][x].render(context);
        }
      }

      for (var y = yMin; y < this.dimensions.height; y++) {
        for (var x = xMin; x < this.dimensions.width; x++) {
          this.tiles[mapY][mapX][y][x].render(context);
        }
      }
    } else {
      for (var y = 0; y < yMax; y++) {
        for (var x = 0; x < xMax; x++) {
          this.tiles[mapY][mapX][y][x].render(context);
        }
      }

      for (var y = yMin; y < this.dimensions.height; y++) {
        for (var x = xMin; x < this.dimensions.width; x++) {
          this.tiles[this.currentMap.y][this.currentMap.x][y][x].render(context);
        }
      }
    }
  };

  this.renderMiniMap = function(context) {
    for (var currentMapY = 0; currentMapY < this.dimensions.mapHeight; currentMapY++) {
      for (var currentMapX = 0; currentMapX < this.dimensions.mapWidth; currentMapX++) {
        for (var y = 0; y < this.dimensions.height; y++) {
          for (var x = 0; x < this.dimensions.width; x++) {
            this.tiles[currentMapY][currentMapX][y][x].render(context, true);
          }
        }
      }
    }
  };

  this.move = function(character, direction, magnitude) {
    switch (direction) {
      case Direction.up:
        if (character.position.y - magnitude < 0 && this.currentMap.y - 1 >= 0
          && this.tiles[this.currentMap.y - 1][this.currentMap.x][this.dimensions.height - 1][character.position.x].walkable) {
          character.position.y = this.dimensions.height - 1;
          this.transitionMaps(direction);
          character.setMapPosition(this.currentMap);
        } else if (character.position.y - magnitude >= 0
          && this.tiles[this.currentMap.y][this.currentMap.x][character.position.y - magnitude][character.position.x].walkable) {
          --character.position.y;
          character.tween(direction);
        }
        break;
      case Direction.down:
        if (character.position.y + magnitude >= this.dimensions.height && this.currentMap.y + 1 < this.dimensions.mapWidth
          && this.tiles[this.currentMap.y + 1][this.currentMap.x][0][character.position.x].walkable) {
          character.position.y = 0;
          this.transitionMaps(direction);
          character.setMapPosition(this.currentMap);
        } else if (character.position.y + magnitude < this.dimensions.height
          && this.tiles[this.currentMap.y][this.currentMap.x][character.position.y + magnitude][character.position.x].walkable) {
          ++character.position.y;
          character.tween(direction);
        }
        break;
      case Direction.left:
        if (character.position.x - magnitude < 0 && this.currentMap.x - 1 >= 0
          && this.tiles[this.currentMap.y][this.currentMap.x - 1][character.position.y][this.dimensions.width - 1].walkable) {
          character.position.x = this.dimensions.width - 1;
          this.transitionMaps(direction);
          character.setMapPosition(this.currentMap);
        } else if (character.position.x - magnitude >= 0
          && this.tiles[this.currentMap.y][this.currentMap.x][character.position.y][character.position.x - magnitude].walkable) {
          --character.position.x;
          character.tween(direction);
        }
        break;
      case Direction.right:
        if (character.position.x + magnitude >= this.dimensions.width && this.currentMap.x + 1 < this.dimensions.mapHeight
          && this.tiles[this.currentMap.y][this.currentMap.x + 1][character.position.y][0].walkable) {
          character.position.x = 0;
          this.transitionMaps(direction);
          character.setMapPosition(this.currentMap);
        } else if (character.position.x + magnitude < this.dimensions.width
          && this.tiles[this.currentMap.y][this.currentMap.x][character.position.y][character.position.x + magnitude].walkable) {
          ++character.position.x;
          character.tween(direction);
        }
        break;
    }
  };

  this.typeToTile = function(type) {
    for (var tile in TileType) {
      if (TileType[tile].type === type) {
        return TileType[tile];
      }
    }

    return TileType.air;
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
