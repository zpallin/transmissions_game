// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application();

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

////////////////////////////////////////////////////////////////////////////////
// global input
keys.register({
	keys: [KEY.ONE],
	mode: 'down',
	action: function() {
		trackManager.nextTrack();
		//console.log(trackManager.idx);
	}
});

keys.register({
	keys: [KEY.ONE],
	mode: 'up',
	action: function() {
		trackManager.hold = false;
	}
});

keys.setListeners();

////////////////////////////////////////////////////////////////////////////////
var volt;

trackManager.tracks.push(new Track(
	{ x: 50, y: 200 },
	[ {x: 0, y: 0}, {x: 300, y: 300}],
	{	
		"leftDown": {
			keys: [KEY.LEFT],
			mode: 'down',
			action: function() {
				volt.setAnimation("run", 0.1, {x:-1});
				volt.move.left = true;
			}
		},
		"rightDown": {
			keys: [KEY.RIGHT], 
			mode: 'down', 
			action: function() {
				volt.setAnimation("run", 0.1, {x:1}); 
				volt.move.right = true;
			}
		},
		"leftUp": {
			keys: [KEY.LEFT],
			mode: 'up',
			action: function() {
				volt.setAnimation("idle", 0.1, {x:-1});
				volt.move.left = false;
			} 
		},
		"rightUp": { 
			keys: [KEY.RIGHT], 
			mode: 'up', 
			action: function() { 
				volt.setAnimation("idle", 0.1, {x:1}); 
				volt.move.right = false;
			}
		}
	}
));

trackManager.tracks.push(new Track(
	{ x: 100, y: 100 },
	[ {x: 0, y: 0}, {x: 100, y: 0}],
	{	
		"leftDown": {
			keys: [KEY.LEFT],
			mode: 'down',
			action: function() {
				volt.setAnimation("run", 0.1, {x:-1});
				volt.move.left = true;
			}
		},
		"rightDown": { 
			keys: [KEY.RIGHT], 
			mode: 'down', 
			action: function() { 
				volt.setAnimation("run", 0.1, {x:1}); 
				volt.move.right = true;
			}
		},
		"leftUp": {
			keys: [KEY.LEFT],
			mode: 'up',
			action: function() {
				volt.setAnimation("idle", 0.1, {x:-1});
				volt.move.left = false;
			} 
		},
		"rightUp": { 
			keys: [KEY.RIGHT], 
			mode: 'up', 
			action: function() { 
				volt.setAnimation("idle", 0.1, {x:1}); 
				volt.move.right = false;
			}
		}
	}
));

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

