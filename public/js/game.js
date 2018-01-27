// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application();

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

/*
 *	keys
 */
var KEY = {
  SPACE: 32,
  LEFT: 37,
	UP: 38,
  RIGHT: 39,
	DOWN: 40,
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
function Entity(name, stage, defaultScale) {
	this.name = name;
	this.stage = stage;
	this.pos = {
		x: 0,
		y: 0
	}
	
	this.track = new Track(
		{
			startX: 10,
			startY: 10,
			endX: 50,
			endY: 10
		},
		function(entity, track) {
			return entity.move.spaceBar === true;
		},
		1
	);

	console.log(this.track.trans);

	this.anim; // currently loaded animation
	this.anims = {}; // obj of all available animations by key
	this.move = {
		left: false,
		right: false,
		speed: 10,
		spaceBar: false,
	}

	this.defaultScale = {
		x: 1,
		y: 1,
		size: 1
	};

	this.defaultScale.x = defaultValue(defaultScale.x, this.defaultScale.x);
	this.defaultScale.y = defaultValue(defaultScale.y, this.defaultScale.y);
	this.defaultScale.size = defaultValue(defaultScale.size, this.defaultScale.size);

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

Entity.prototype.setAnimation = function(key, speed, scale) {
	var speed = defaultValue(speed, this.animSpeed);
	var key 	= defaultValue(key, Object.keys(this.anims)[0]);
	this.mergeScale(scale);

	if (key in this.anims) {
		// stop the existing animation
		this.stage.removeChild(this.anim);

		// add a new animation
		this.anim 								= this.anims[key];
		this.anim.scale.x 				= this.scale.x * this.scale.size;
		this.anim.scale.y 				= this.scale.y * this.scale.size;
		this.anim.animationSpeed 	= speed;
		this.anim.x 							= this.pos.x;
		this.anim.y 							= this.pos.y;

		this.stage.addChild(this.anim);
	} else {
		console.error("Anim " + key + " for " + this.name + " does not exist!");
	}
}

Entity.prototype.resetPos = function() {
	this.pos.x = 0;
	this.pos.y = 0;
}

Entity.prototype.bindPosTrack = function() {
	var trans = this.track.trans;	
	var slope = (trans.startX - trans.endX) / (trans.startY - trans.endY);
	if (isNaN(slope)) {
		slope = 1;
	}
	console.log(trans);
	console.log("slope: " + slope);
	var x = this.pos.x + trans.startX;
	if (x < trans.startX) {
		this.pos.x = 0;
		x = trans.startX;
	}

	if (x > trans.endX) {
		this.pos.x = trans.endX - trans.startX;
		x = trans.endX;
	}

	console.log(x*slope);
	console.log(trans.startX / slope);
	console.log(trans.startY);

	var y = (x * slope) - ((trans.startX/slope) + trans.startY);

	return {x: x, y: y};
}

Entity.prototype.animate = function() {
	if (typeof this.anim !== 'undefined') {

		this.pos.x += this.move.right? this.move.speed : 0;
		this.pos.x -= this.move.left? this.move.speed : 0;
		var pos = this.bindPosTrack();
		console.log(pos);
	
		this.anim.x = pos.x;
		this.anim.y = pos.y;
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
function Track(trans, trigger, speed) {
	this.trans		= trans;
	this.trigger 	= trigger; // is a callback
	this.speed 		= defaultValue(speed, 10);
}

Track.prototype.eval = function(parent) {
	if (trigger(parent, this)) {
		
	}
}

var tracks = [];


////////////////////////////////////////////////////////////////////////////////

var volt;

////////////////////////////////////////////////////////////////////////////////
// load the texture we need
PIXI.loader
		.add("/public/img/voltRun.json")
		.load(setup);

function setup(loader, resources) {
 	volt = new Entity("volt", app.stage, {size: 0.3});
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
	volt.setAnimation("idle", 0.5); 

	keys = new Keys();
	keys.register({ 
		keys: [KEY.LEFT], 
		mode: 'down', 
		action: function() { 
			volt.setAnimation("run", 0.5, {x:-1}); 
			volt.moveLeft();
		} 
	});
	keys.register({ 
		keys: [KEY.RIGHT], 
		mode: 'down', 
		action: function() { 
			volt.setAnimation("run", 0.5, {x:1}); 
			volt.moveRight();
		} 
	});
	keys.register({ 
		keys: [KEY.LEFT], 
		mode: 'up', 
		action: function() { 
			volt.setAnimation("idle", 0.5, {x:-1}); 
			volt.moveStop();
		} 
	});
	keys.register({ 
		keys: [KEY.RIGHT], 
		mode: 'up', 
		action: function() { 
			volt.setAnimation("idle", 0.5, {x:1}); 
			volt.moveStop();
		} 
	});
	keys.setListeners();
}

function gameLoop(time) {
  var f = requestAnimationFrame(gameLoop);
  app.renderer.render(app.stage);
	if (volt) {
		volt.animate();
	}
}

gameLoop();
