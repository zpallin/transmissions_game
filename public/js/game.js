// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application();

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

/*
 * keys
 */
var KEY = {
  SPACE: 32,
  LEFT: 37,
	UP: 38,
  RIGHT: 39,
	DOWN: 40,
};

/*
 * globals
 */
var GLOBALS = {
	effects: [ RainEmitter.init(app.stage) ]
};

// keys manager
function Keys() {
  this.registry = [];
}
Keys.prototype.register = function(reg) {
  this.registry.push({
    keys: reg.keys,
    mode: reg.mode,
    action: reg.action,
  });
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
  document.addEventListener('keydown', function(ev) { onkey(ev.keyCode, 'down'); }, false);
  document.addEventListener('keyup', function(ev) { onkey(ev.keyCode, 'up'); }, false);
}


/*
 *	helpers
 */

function defaultValue(variable, def) {
	return typeof variable === 'undefined'? def : variable;
}

/*
 *	object that represents a rendered entity
 */
function Entity(name, defaultScale) {
	this.name = name;
	this.pos = {
		x: 0,
		y: 0
	}
	this.anim; // currently loaded animation
	this.anims = {}; // obj of all available animations by key
	this.move = {
		left: false,
		right: false,
		speed: 10
	}

	this.defaultScale = defaultValue(defaultScale, {
		x: 1,
		y: 1,
		size: 1
	});

	this.scale = JSON.parse(
		JSON.stringify(this.defaultScale)
	);

	this.animSpeed = 0.5;
}

Entity.prototype.mergeScale = function(newScale) {
	var newScale 		= defaultValue(newScale, {});
	this.scale.x 		= defaultValue(newScale.x, this.scale.x);
	this.scale.y 		= defaultValue(newScale.y, this.scale.y);
	this.scale.size = defaultValue(newScale.size, this.scale.size);
	//console.log(this.scale);
}

Entity.prototype.addAnimation = function(name, pre, post, count) {
	var frames = [];
	for (var i = 0; i < count; i++) {
		var fileName = pre + i + post;
		frames.push(new PIXI.Texture.fromFrame(pre + i + post));
	}

	this.anims[name] = new PIXI.extras.AnimatedSprite(frames);
	this.anims[name].anchor.set(0.5, 0.5);

	// if this.anim is not set, set it to the first animation loaded
	this.anim = defaultValue(this.anim, this.anims[name]);
}

Entity.prototype.moveRight = function() {
	this.move.right = true;
}

Entity.prototype.moveLeft = function() {
	this.move.left = true;
}

Entity.prototype.moveStop = function() {
	this.move.left = false;
	this.move.right = false;
}

Entity.prototype.setAnimation = function(stage, key, speed, scale) {
	var stage = defaultValue(stage, false);
	if (!stage) return null;

	var speed = defaultValue(speed, this.animSpeed);
	var key 	= defaultValue(key, Object.keys(this.anims)[0]);
	this.mergeScale(scale);

	if (key in this.anims) {
		// stop the existing animation
		stage.removeChild(this.anim);

		// add a new animation
		this.anim 								= this.anims[key];
		this.anim.scale.x 				= this.scale.x * this.scale.size;
		this.anim.scale.y 				= this.scale.y * this.scale.size;
		this.anim.animationSpeed 	= speed;
		this.anim.x 							= this.pos.x;
		this.anim.y 							= this.pos.y;

		stage.addChild(this.anim);
	} else {
		console.error("Anim " + key + " for " + this.name + " does not exist!");
	}
}

Entity.prototype.animate = function() {
	if (typeof this.anim !== 'undefined') {
		this.pos.x += this.move.right? this.move.speed : 0;
		this.pos.x -= this.move.left? this.move.speed : 0;
	
		this.anim.x = this.pos.x;
		this.anim.y = this.pos.y;
		this.anim.play();
	}
}

Entity.prototype.stopAnimation = function(stage) {
	this.anim.stop();
	if (typeof stage !== 'undefined') {
		stage.removeChild(this.anim);
	}
}

////////////////////////////////////////////////////////////////////////////////
function Track() {
	
}


////////////////////////////////////////////////////////////////////////////////

var volt = new Entity("volt");

////////////////////////////////////////////////////////////////////////////////
// load the texture we need
PIXI.loader
		.add("/public/img/voltRun.json")
		.load(setup);

function setup(loader, resources) {
	//385x280
	volt.addAnimation(
		"run",
		"volt_run.0.",
		".png",
		10
	);
	volt.addAnimation(
		"idle",
		"volt_run.0.",
		".png",
		1
	);
	volt.setAnimation(app.stage, "idle", 0.5); 

	keys = new Keys();
	keys.register({ 
		keys: [KEY.LEFT], 
		mode: 'down', 
		action: function() { 
			volt.setAnimation(app.stage, "run", 0.5, {x:-1}); 
			volt.moveLeft();
		} 
	});
	keys.register({ 
		keys: [KEY.RIGHT], 
		mode: 'down', 
		action: function() { 
			volt.setAnimation(app.stage, "run", 0.5, {x:1}); 
			volt.moveRight();
		} 
	});
	keys.register({ 
		keys: [KEY.LEFT], 
		mode: 'up', 
		action: function() { 
			volt.setAnimation(app.stage, "idle", 0.5, {x:-1}); 
			volt.moveStop();
		} 
	});
	keys.register({ 
		keys: [KEY.RIGHT], 
		mode: 'up', 
		action: function() { 
			volt.setAnimation(app.stage, "idle", 0.5, {x:1}); 
			volt.moveStop();
		} 
	});
	keys.register({
		keys: [KEY.SPACE],
		mode: 'up',
		action: function() {
			if (RainEmitter.isEmitting()) {
				RainEmitter.stop();
			} else {
				RainEmitter.start();
			}
		}
	})
	keys.setListeners();
}

var elapsed = Date.now();
function gameLoop(time) {
	var f = requestAnimationFrame(gameLoop);

	// Run all screen effects
	var now = Date.now();
	for (var effect in GLOBALS.effects) {
		GLOBALS.effects[effect].update((now - elapsed) * 0.001)
	}
	elapsed = now;

  app.renderer.render(app.stage);
	volt.animate();
}

gameLoop();
