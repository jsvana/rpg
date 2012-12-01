var Game = function() {
  this.running = true;
  this.gameWindow;
  this.miniMapWindow;
  this.hero;
  this.world;
  this.gameTimer;
  this.assets;

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

      if (self.world.isTweening()) {
        self.world.tweenMaps();
      } else {
        if (self.hero.isTweening()) {
          self.hero.tween();
        } else {
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
        }
      }

      self.render(self.gameWindow, self.miniMapWindow, self.assets);
    };
  })(this);

  this.initialize = function() {
    this.gameWindow = document.getElementById('c').getContext('2d');
    this.miniMapWindow = document.getElementById('minimap').getContext('2d');

    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);

    var self = this;

    RPG.loadAssets({
      character: 'assets/character.png',
      tileset: 'assets/tileset.mountain.png'
    }, function(count, max) {
      console.log('loaded ' + count + '/' + max);
    }, function(assets) {
      self.assets = assets;

      self.hero = new Character();
      self.hero.initialize();

      self.world = new World(assets);
      self.world.initialize();

      self.hero.setMapDimensions(self.world.getMapDimensions());

      self.gameTimer = RPG.timer(RPG.fpsToMS(50), gameLoop);
    });
  };

  this.render = function(gameContext, miniMapContext) {
    gameContext.clearRect(0, 0, 400, 400);
    miniMapContext.clearRect(0, 0, 400, 400);

    this.world.render(gameContext);
    this.world.renderMiniMap(miniMapContext);
    this.hero.render(gameContext, miniMapContext);
  };
};
