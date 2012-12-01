var Tile = function(type, position, mapDimensions, assets) {
  this.type = type;
  this.walkable = true;
  this.position = position;
  this.dimensions = {
    width: 32,
    height: 32
  };

  this.assets = assets;

  if (mapDimensions) {
    this.dimensions.mapWidth = mapDimensions.width || 0;
    this.dimensions.mapHeight = mapDimensions.height || 0;
  }

  this.render = function(context, small) {
    context.save();

    var width, height;
    var x, y;
    var imageX = this.type % 16;
    var imageY = Math.floor(this.type / 16);

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

    context.drawImage(this.assets.tileset,
      imageX * width, imageY * height, width, height,
      x, y, width, height);

    context.restore();
  };
};
