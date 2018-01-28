// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application({height: 600, width: 600});

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

////////////////////////////////////////////////////////////////////////////////

var GLOBALS = {
	effects: [ RainEmitter.init(app.stage) ]
};

var volt;
var tracks = {};

tracks["first"] = new Track(
	{ 
		start: { x: 300, y: 300 },
		limit: { right: 500, left: 100, up: 300, down: 300 }
	},
	{	
		"leftDown": {
			keys: [KEY.LEFT],
			mode: 'down',
			action: function() {
				volt.setAnimation("run", 0.5, {x:-1});
				volt.move.left = true;
			}
		},
		"rightDown": { 
			keys: [KEY.RIGHT], 
			mode: 'down', 
			action: function() { 
				volt.setAnimation("run", 0.5, {x:1}); 
				volt.move.right = true;
			}
		},
		"leftUp": {
			keys: [KEY.LEFT],
			mode: 'up',
			action: function() {
				volt.setAnimation("idle", 0.5, {x:-1});
				volt.unsetMove("left");
			} 
		},
		"rightUp": { 
			keys: [KEY.RIGHT], 
			mode: 'up', 
			action: function() { 
				volt.setAnimation("idle", 0.5, {x:1}); 
				volt.unsetMove("right");
			} 
		},
		"space": {
			keys: [KEY.SPACE],
			mode: 'up',
			action: function() {
				if (RainEmitter.isEmitting()) {
					RainEmitter.stop();
				} else {
					RainEmitter.start();
				}
			}
		}
	});


////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// load the texture we need
PIXI.loader
		.add("/public/img/voltRun.json")
		.add("/public/img/GGJ-Scene1-rainy.png")
		.load(setup);

function setup(loader, resources) {
	var background = new PIXI.Sprite(
		PIXI.loader.resources["/public/img/GGJ-Scene1-rainy.png"].texture
	);
	background.scale.set(0.2, 0.2);
	background.position.set(0, 0);
	app.stage.addChild(background); 
	
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
	if (volt) {
		volt.animate();
	}
}

gameLoop();
