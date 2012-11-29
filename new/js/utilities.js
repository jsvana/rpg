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
  }
};
