var Tile = function(layers, assets) {
  this.types = layers;
  this.walkable = true;
  this.dimensions = {
    width: 32,
    height: 32
  };

  this.assets = assets;

  this.render = function(context, x, y) {
    context.save();

    var width = this.dimensions.width;
    var height = this.dimensions.height;

    for (var layer = 0; layer < this.types.length; layer++) {
      var imageX = this.types[layer] % 16 - 1;
      var imageY = Math.floor(this.types[layer] / 16);

      if (imageX < 0) {
        --imageY;
        imageX = 15;
      }

      if (this.types[layer] === 0) {
        //context.fillStyle = '#ffffff';
        //context.fillRect(x, y, width, height);
      } else {
        context.drawImage(this.assets.tileset,
          imageX * width, imageY * height, width, height,
          x, y, width, height);
      }
    }

    context.restore();
  };
};
