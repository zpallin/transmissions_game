// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application();

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);
var volt;
var background;

////////////////////////////////////////////////////////////////////////////////
// global input
keys.register({
	keys: [KEY.ONE],
	mode: 'down',
	action: function() {
		volt.tmgr.nextTrack();
		//console.log(trackManager.idx);
	}
});

keys.register({
	keys: [KEY.ONE],
	mode: 'up',
	action: function() {
		volt.tmgr.hold = false;
	}
});

keys.setListeners();

////////////////////////////////////////////////////////////////////////////////

function voltTracks() {
	volt.tmgr.tracks.push(new Track(
		{ x: 200, y: 0 },
		[ {x: 0, y: 590}, {x: 600, y: 590}],
		{	
			"leftDown": {
				keys: [KEY.LEFT],
				mode: 'down',
				action: function() {
					if (!volt.move.left) {
						volt.setAnimation("run", 0.1, {x:-1});
						volt.move.left = true;
					}
				}
			},
			"rightDown": {
				keys: [KEY.RIGHT], 
				mode: 'down', 
				action: function() {
					if (!volt.move.right) {
						volt.setAnimation("run", 0.1, {x:1}); 
						volt.move.right = true;
					}
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
			},
			"spacebar": {
				keys: [KEY.SPACE],
				mode: 'down',
				action: function() {
				}
			}
		}
	));
	volt.tmgr.tracks.push(new Track(
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
}
////////////////////////////////////////////////////////////////////////////////
// load the texture we need
PIXI.loader
		.add("/public/img/voltRun.json")
		.add("/public/img/bg.png")
		.load(setup);

function setup(loader, resources) {
	var background = new PIXI.Sprite(
		PIXI.loader.resources["/public/img/bg.png"].texture
	);
	background.scale.set(0.789, 0.589);
	background.position.set(0, 0);
	app.stage.addChild(background);

 	volt = new Entity("volt", app.stage, {size: 0.1});
	voltTracks();
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
	volt.setAnimation("idle", 0.1);
}

function gameLoop(time) {
  var f = requestAnimationFrame(gameLoop);
  app.renderer.render(app.stage);
	if (volt) {
		volt.animate();
	}
}

gameLoop();

