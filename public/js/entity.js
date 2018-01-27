/*
 *  object that represents a rendered entity
 */
function Entity(name, stage, defaultScale) {
  this.name = name;
  this.stage = stage;
  this.pos = {
    x: 0,
    y: 0
  }

  this.anim; // currently loaded animation
  this.anims = {}; // obj of all available animations by key
  this.move = {
    left: false,
    right: false,
		up: false,
		down: false,
    spaceBar: false
  }
	this.moveSpeed = 10;

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

Entity.prototype.unsetMove = function(which) {
	var which = defaultValue(which, []);
	if (which.length() === 0) {
		which = this.move.keys();
	}
	for (var key in which) {
		this.move[key] = false;
	}
}

Entity.prototype.mergeScale = function(newScale) {
  var newScale    = defaultValue(newScale, {});
  this.scale.x    = defaultValue(newScale.x, this.scale.x);
  this.scale.y    = defaultValue(newScale.y, this.scale.y);
  this.scale.size = defaultValue(newScale.size, this.scale.size);
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

Entity.prototype.setAnimation = function(key, speed, scale) {
  var speed = defaultValue(speed, this.animSpeed);
  var key   = defaultValue(key, Object.keys(this.anims)[0]);
  this.mergeScale(scale);

  if (key in this.anims) {
    // stop the existing animation
    this.stage.removeChild(this.anim);

    // add a new animation
    this.anim                 = this.anims[key];
    this.anim.scale.x         = this.scale.x * this.scale.size;
    this.anim.scale.y         = this.scale.y * this.scale.size;
    this.anim.animationSpeed  = speed;
    this.anim.x               = this.pos.x;
    this.anim.y               = this.pos.y;

    this.stage.addChild(this.anim);
  } else {
    console.error("Anim " + key + " for " + this.name + " does not exist!");
  }
}

Entity.prototype.resetPos = function() {
  this.pos.x = 0;
  this.pos.y = 0;
}

Entity.prototype.animate = function() {
  if (typeof this.anim !== 'undefined') {

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
