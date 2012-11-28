var Satchel = function() {
  this.items = [];

  this.addItem = function(item) {
    this.items.push(item);
  };

  this.useItem = function(index, target) {
    if (index < 0 || index >= this.items.length) {
      return null;
    }

    var item = this.items[index];

    item.use(target);

    --item.uses;

    if (item.uses < 1) {
      this.items.splice(index, 1);
    }

    return item;
  };

  this.getItems = function() {
    return this.items;
  };
};
