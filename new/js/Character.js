var Character = function(name) {
  this.name = name || 'Steve';

  this.hp = 100;
  this.maxHP = 100;

  this.mp = 100;
  this.maxMP = 100;

  this.position = {};
  this.dimensions = {};

  this.satchel = new Satchel();

  this.initialize = function() {
    this.position = { x: 0, y: 0, mapX: 0, mapY: 0 };
    this.dimensions = { width: 20, height: 20, mapWidth: 0, mapHeight: 0 };
  };

  this.render = function(gameContext, miniMapContext) {
    var oldGameStroke = gameContext.strokeStyle;
    var oldGameFill = gameContext.fillStyle;
    var oldMiniMapStroke = miniMapContext.strokeStyle;
    var oldMiniMapFill = miniMapContext.fillStyle;

    var x = this.position.x * this.dimensions.width + this.dimensions.width / 2;
    var y = this.position.y * this.dimensions.height + this.dimensions.height / 2;
    var radius = this.dimensions.width / 2;

    gameContext.strokeStyle = '#303ac7';
    gameContext.fillStyle = '#3060c7';
    miniMapContext.strokeStyle = '#303ac7';
    miniMapContext.fillStyle = '#3060c7';

    gameContext.beginPath();
    gameContext.arc(x, y, radius - 1, 0, 2 * Math.PI, false);
    gameContext.fill();
    gameContext.stroke();
    gameContext.closePath();

    miniMapContext.beginPath();
    console.log('mapX: ' + this.position.mapX + ', mapWidth: ' + this.dimensions.mapWidth + ', width: ' + this.dimensions.width);
    miniMapContext.arc((this.position.mapX * this.dimensions.mapWidth * this.dimensions.width + x) / 2,
      (this.position.mapY * this.dimensions.mapHeight * this.dimensions.height + y) / 2,
      radius / 2 - 1, 0, 2 * Math.PI, false);
    miniMapContext.fill();
    miniMapContext.stroke();
    miniMapContext.closePath();

    gameContext.strokeStyle = oldGameStroke;
    gameContext.fillStyle = oldGameFill;
    miniMapContext.strokeStyle = oldMiniMapStroke;
    miniMapContext.fillStyle = oldMiniMapFill;
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
  }
};
