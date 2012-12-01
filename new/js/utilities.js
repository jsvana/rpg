var RPG = {
  timer: function(timeout, func) {
    var timerID = setInterval(func, timeout);

    return {
      func: func,
      timeout: timeout,
      id: timerID
    };
  },

  stopTimer: function(timer) {
    if (timer.id) {
      clearInterval(timer.id);
    }
  },

  fpsToMS: function(fps) {
    return 1000 / fps;
  },

  loadAssets: function(assets, progress, completed) {
    var loadedAssets = {};
    var totalCount = Object.keys(assets).length;
    var count = 0;

    for (var asset in assets) {
      loadedAssets[asset] = new Image();
      loadedAssets[asset].src = assets[asset];
      loadedAssets[asset].onload = function() {
        ++count;
        progress(count, totalCount);

        if (count === totalCount) {
          completed(loadedAssets);
        }
      };
    }
  }
};
