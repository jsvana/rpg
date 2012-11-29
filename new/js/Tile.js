var Tile = function(type, position, mapDimensions) {
  this.type = type;
  this.walkable = true;
  this.position = position;
  this.dimensions = {
    width: 20,
    height: 20
  };

  if (mapDimensions) {
    this.dimensions.mapWidth = mapDimensions.width || 0;
    this.dimensions.mapHeight = mapDimensions.height || 0;
  }

  if (this.type === TileType.water) {
    this.walkable = false;
  }

  this.render = function(context, small) {
    var oldStroke = context.strokeStyle;
    var oldFill = context.fillStyle;
    var width, height;
    var x, y;

    if (small) {
      width = this.dimensions.width / 4;
      height = this.dimensions.height / 4;

      x = this.position.mapX * this.dimensions.mapWidth * width + this.position.x * width;
      y = this.position.mapY * this.dimensions.mapHeight * height + this.position.y * height;
    } else {
      width = this.dimensions.width;
      height = this.dimensions.height;

      x = this.position.x * width;
      y = this.position.y * height;
    }

    switch (type) {
      case TileType.water:
        context.strokeStyle = '#0000bb';
        context.fillStyle = '#0000bb';

        context.fillRect(x, y, width, height);

        break;
      case TileType.grass:
        context.strokeStyle = '#00bb00';
        context.fillStyle = '#00bb00';

        context.fillRect(x, y, width, height);

        break;
      case TileType.air:
      default:
        break;
    };

    context.strokeStyle = oldStroke;
    context.fillStyle = oldFill;
  };
};
