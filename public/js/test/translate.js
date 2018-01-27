// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application();

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

////////////////////////////////////////////////////////////////////////////////
var volt;
var tracks = {};

tracks["first"] = new Track(
	{ 
		start: { x: 300, y: 300 },
		translate: { right: 500, left: 100, up: 300, down: 300 }
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
		}
	});


////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// load the texture we need
PIXI.loader
		.add("/public/img/voltRun.json")
		.load(setup);

function setup(loader, resources) {
 	volt = new Entity("volt", app.stage, {size: 0.3});
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

function gameLoop(time) {
  var f = requestAnimationFrame(gameLoop);
  app.renderer.render(app.stage);
	if (volt) {
		volt.animate();
	}
}

gameLoop();
