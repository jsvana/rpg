var Game = function() {
  this.running = true;
  this.gameWindow;
  this.miniMapWindow;
  this.hero;
  this.world;

  var keyDown = (function(self) {
    return function(e) {
      if (e.which < 37 || e.which > 40) {
        return;
      }

      switch (e.which) {
        case 38:
          self.world.move(self.hero, Direction.up, 1);
          break;
        case 40:
          self.world.move(self.hero, Direction.down, 1);
          break;
        case 37:
          self.world.move(self.hero, Direction.left, 1);
          break;
        case 39:
          self.world.move(self.hero, Direction.right, 1);
          break;
      }

      self.render(self.gameWindow, self.miniMapWindow);
    };
  })(this);

  this.initialize = function() {
    this.gameWindow = document.getElementById('c').getContext('2d');
    this.miniMapWindow = document.getElementById('minimap').getContext('2d');

    this.hero = new Character();
    this.hero.initialize();

    this.world = new World();
    this.world.initialize();

    this.hero.setMapDimensions(this.world.getMapDimensions());

    document.addEventListener('keydown', keyDown, false);

    this.render(this.gameWindow, this.miniMapWindow);
  };

  this.render = function(gameContext, miniMapContext) {
    gameContext.clearRect(0, 0, 400, 400);
    miniMapContext.clearRect(0, 0, 400, 400);

    this.world.render(gameContext);
    this.world.renderMiniMap(miniMapContext);
    this.hero.render(gameContext, miniMapContext);
  };
};
