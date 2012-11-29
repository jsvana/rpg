var Game = function() {
  this.running = true;
  this.gameWindow;
  this.miniMapWindow;
  this.hero;
  this.world;
  this.gameTimer;
  this.arrowKeys = [false, false, false, false];

  var keyDown = (function(self) {
    return function(e) {
      if (e.which < 37 || e.which > 40) {
        return;
      }

      self.arrowKeys[e.which - 37] = true;
    };
  })(this);

  var keyUp = (function(self) {
    return function(e) {
      if (e.which < 37 || e.which > 40) {
        return;
      }

      self.arrowKeys[e.which - 37] = false;
    };
  })(this);

  var gameLoop = (function(self) {
    return function() {
      if (!self.running) {
        RPG.stopTimer(self.timer);
      }

      if (self.arrowKeys[Direction.up]) {
        self.world.move(self.hero, Direction.up, 1);
      } else if (self.arrowKeys[Direction.down]) {
        self.world.move(self.hero, Direction.down, 1);
      }

      if (self.arrowKeys[Direction.left]) {
        self.world.move(self.hero, Direction.left, 1);
      } else if (self.arrowKeys[Direction.right]) {
        self.world.move(self.hero, Direction.right, 1);
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
    document.addEventListener('keyup', keyUp, false);
    this.gameTimer = RPG.timer(RPG.fpsToMS(20), gameLoop);

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
