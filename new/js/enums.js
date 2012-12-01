var Direction = {
  left: 0,
  up: 1,
  right: 2,
  down: 3
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
