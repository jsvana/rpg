var World = function() {
  this.tiles = [];
  this.location = {};
  this.dimensions = {};

  this.initialize = function() {
    this.tiles = [];

    this.currentMap = { x: 0, y: 0 };

    this.dimensions = { mapWidth: 2, mapHeight: 2, width: 20, height: 20 };

    for (var currentMapY = 0; currentMapY < this.dimensions.mapHeight; currentMapY++) {
      this.tiles.push([]);
      for (var currentMapX = 0; currentMapX < this.dimensions.mapWidth; currentMapX++) {
        this.tiles[currentMapY].push([]);
        for (var y = 0; y < this.dimensions.height; y++) {
          this.tiles[currentMapY][currentMapX].push([]);
          for (var x = 0; x < this.dimensions.width; x++) {
            var newTile = new Tile(
              map[currentMapY][currentMapX][y][x],
              { mapX: currentMapX, mapY: currentMapY, x: x, y: y },
              { width: this.dimensions.width, height: this.dimensions.height }
            );
            this.tiles[currentMapY][currentMapX][y].push(newTile);
          }
        }
      }
    }
  };

  this.render = function(context) {
    for (var y = 0; y < this.dimensions.height; y++) {
      for (var x = 0; x < this.dimensions.width; x++) {
        this.tiles[this.currentMap.y][this.currentMap.x][y][x].render(context);
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
        }
        break;
      case Direction.right:
        console.log('right');
        console.log('map: { x: ' + this.currentMap.x + ', y: ' + this.currentMap.y + ' }');
        if (character.position.x + magnitude >= this.dimensions.width && this.currentMap.x + 1 < this.dimensions.mapHeight
          && this.tiles[this.currentMap.y][this.currentMap.x + 1][character.position.y][0].walkable) {
          console.log('change');
          character.position.x = 0;
          this.transitionMaps(direction);
          character.setMapPosition(this.currentMap);
        } else if (character.position.x + magnitude < this.dimensions.width
          && this.tiles[this.currentMap.y][this.currentMap.x][character.position.y][character.position.x + magnitude].walkable) {
          ++character.position.x;
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
        return this.switchMaps(this.currentMap.x, this.currentMap.y - 1);
        break;
      case Direction.down:
        return this.switchMaps(this.currentMap.x, this.currentMap.y + 1);
        break;
      case Direction.left:
        return this.switchMaps(this.currentMap.x - 1, this.currentMap.y);
        break;
      case Direction.right:
        return this.switchMaps(this.currentMap.x + 1, this.currentMap.y);
        break;
    }
  };
};
