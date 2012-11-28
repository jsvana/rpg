var Direction = {
  up: 0,
  down: 1,
  left: 2,
  right: 3
};

var Items = {
  potion: function() {
    this.name = 'potion';
    this.uses = 1;
    this.value = 10;
    this.use = function(target) {
      target.heal(this.value);
    };
  },
  ether: function() {
    this.name = 'ether';
    this.uses = 1;
    this.value = 10;
    this.use = function(target) { };
  }
};

var TileType = {
  air: 0,
  grass: 1,
  water: 2
};
