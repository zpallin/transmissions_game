function Track(trans, regKeys, speed, events) {
  this.trans    = defaultValue(trans, { startX: 0, startY: 0, endX: 0, endY: 0});
  this.speed    = defaultValue(speed, 10);

  // something happens during a track
  this.events   = defaultValue(events, function(){});

  // keybindings for this track
  this.keys   = defaultValue(regKeys, {});

  for (var key in this.keys) {
    keys.register(this.keys[key]);
  }
  keys.setListeners();
}

Track.prototype.unregisterKeys = function() {
  for (var key in this.keys) {
    keys.unregister(this.keys[key]);
  }
}

