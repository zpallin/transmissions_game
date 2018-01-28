/*
 *  keys
 */
const keys = new Keys();
var KEY = {
	ONE: 49,
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

// keys manager
function Keys() {
  this.registry = [];
	this.PRESSED = [];
}
Keys.prototype.register = function(reg) {
  this.registry.push({
    keys: reg.keys,
    mode: reg.mode,
    action: reg.action,
  });
}

Keys.prototype.unregister = function(reg) {
  var removeIndex = this.registry.map(function(item) { return item.keys; }).indexOf(reg.keys);
	if (removeIndex !== -1) {
	  this.registry.splice(removeIndex, 1);
	//	console.log(JSON.stringify(this.registry));
	}
}

// adds event listeners that are registered
Keys.prototype.setListeners = function() {
  var registry = this.registry;
  var onkey = function(keyCode, mode) {
    var n, k;
    for(n = 0 ; n < registry.length ; n++) {
      k = registry[n];
      k.mode = k.mode || 'up';
      if ((k.keys && (k.keys.indexOf(keyCode) >= 0))) {
        if (k.mode == mode) {
          k.action.call();
        }
      }
    }
  };

  // add event listeners
	var dis = this;
  document.addEventListener('keydown', function(ev) { 
			var idx = dis.PRESSED.indexOf(ev.keyCode);
      if (idx === -1) {
				onkey(ev.keyCode, 'down'); 
				dis.PRESSED.push(ev.keyCode)
			}
		}, 
		false);
  document.addEventListener('keyup', function(ev) { 
			onkey(ev.keyCode, 'up'); 
			var idx = dis.PRESSED.indexOf(ev.keyCode);
			if (idx !== -1) {
				dis.PRESSED.splice(idx, 1);	
			}
		}, 
		false);
}

Keys.prototype.removeListeners = function() {
  this.registry = [];
}
