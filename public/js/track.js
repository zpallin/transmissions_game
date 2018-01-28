var trackManager = new TrackManager();
function TrackManager() {
	this.tracks = [];
	this.idx = 0;
	this.hold = false;
}

TrackManager.prototype.current = function() {
	return this.tracks[this.idx];
}

TrackManager.prototype.addTrack = function(track) {
	this.tracks.push(track);
	if (this.tracks.length === 1) {
		this.current().registerKeys();
	}
}

TrackManager.prototype.runEvents = function() {
	this.current().events();
}

TrackManager.prototype.nextTrack = function() {
	if (this.hold !== true) {
		this.current().unregisterKeys();
		this.idx = (this.idx + 1) % this.tracks.length;
		this.hold = true;
		this.current().registerKeys();
	}
}

function Track(trans, bound, regKeys, speed, events) {
  this.trans    = defaultValue(trans, { x: 0, y: 0 });
	this.bound		= defaultValue(bound, [{x: 0, y: 0}, {x: 0, y: 0}]);
  this.speed    = defaultValue(speed, 10);

  // something happens during a track
  this.events   = defaultValue(events, function(){});

  // keybindings for this track
  this.keys   = defaultValue(regKeys, {});
}

Track.prototype.registerKeys = function() {
  for (var key in this.keys) {
    keys.register(this.keys[key]);
		console.log("registering: " + JSON.stringify(this.keys[key]));
  }
  keys.setListeners();
}

Track.prototype.unregisterKeys = function() {
  for (var key in this.keys) {
    keys.unregister(this.keys[key]);
		console.log("unregistering: " + JSON.stringify(this.keys[key]));
  }
}

