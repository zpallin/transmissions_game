// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application(width=600, height=600);

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
		out = JSON.stringify(volt.tmgr.tracks[volt.tmgr.idx].bound);
		console.log(volt.tmgr.idx + ": " + out);
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
function backgroundGenerator(loader) {

	//these are actually all "loaded" in the PIXI loader cascade of add commands
	//here they are simply being defined as Sprites attached to an object to
	//store them for management

	var bgs = [];
	bgs.push({name: 'bg-sun', sprite: new PIXI.Sprite(loader.resources['bg-sun'].texture)});
	bgs.push({name: 'bg-city5', sprite: new PIXI.Sprite(loader.resources['bg-city5'].texture)});
	bgs.push({name: 'bg-city4', sprite: new PIXI.Sprite(loader.resources['bg-city4'].texture)});
	bgs.push({name: 'bg-city3', sprite: new PIXI.Sprite(loader.resources['bg-city3'].texture)});
	bgs.push({name: 'bg-city2', sprite: new PIXI.Sprite(loader.resources['bg-city2'].texture)});
	bgs.push({name: 'bg-city1', sprite: new PIXI.Sprite(loader.resources['bg-city1'].texture)});
	bgs.push({name: 'bg-rain', sprite: new PIXI.Sprite(loader.resources['bg-rain'].texture)});
	bgs.push({name: 'bg-scene2-1', sprite: new PIXI.Sprite(loader.resources['bg-scene2-1'].texture)});
	bgs.push({name: 'bg-scene2-2', sprite: new PIXI.Sprite(loader.resources['bg-scene2-2'].texture)});
	bgs.push({name: 'bg-scene3-1', sprite: new PIXI.Sprite(loader.resources['bg-scene3-1'].texture)});
	bgs.push({name: 'bg-scene3-2', sprite: new PIXI.Sprite(loader.resources['bg-scene3-2'].texture)});

	// config
	for (var bg of bgs) {
		bg.sprite.scale.set(0.2, 0.2);
		bg.sprite.position.set(0, 0);
	}
	return bgs;
}

function getBgWithName(bgs, name) {
	for (var key in bgs) {
		if (bgs[key].name === name) {
			return bgs[key].sprite;
		}
	}
	return {};
}
////////////////////////////////////////////////////////////////////////////////
// load the texture we need
PIXI.loader
		.add("/public/img/voltRun.json")
		.add("/public/img/bg.png")
		.add('bg-city1', '/public/img/Scene Images/bldgs-layer1-trans-back.png')
		.add('bg-city2', '/public/img/Scene Images/bldgs-layer1-w.back.png')
		.add('bg-city3', '/public/img/Scene Images/bldgs-layer2-w.back.png')
		.add('bg-city4', '/public/img/Scene Images/bldgs-layer4-w.back.png')
		.add('bg-city5', '/public/img/Scene Images/blgds-layer3-w.back.png')
		.add('bg-rain', '/public/img/Scene Images/scene1-rainy.png')
		.add('bg-sun', '/public/img/Scene Images/scene1-sunny.png')
		.add('bg-scene2-1', '/public/img/Scene Images/scene2-trans-back.png')
		.add('bg-scene2-2', '/public/img/Scene Images/scene2-w.back.png')
		.add('bg-scene3-1', '/public/img/Scene Images/scene3-rainy.png')
		.add('bg-scene3-2', '/public/img/Scene Images/scene3-sunny.png')
		.add('bg-scene3-3', '/public/img/Scene Images/scene3-trans-back.png')
		.add('bg-tower', '/public/img/Scene Images/tower-trans-back.png')
		.load(setup);

function setup(loader, resources) {
	var bgs = backgroundGenerator(loader);		

	app.stage.addChild(getBgWithName(bgs, "bg-sun"));

 	volt = new Entity("volt", app.stage, {size: 0.1});
//	voltTracks();
	voltPlayer = new Player(volt);
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
	volt.tmgr.current().registerKeys();
}

function gameLoop(time) {
  var f = requestAnimationFrame(gameLoop);
  app.renderer.render(app.stage);
	if (volt) {
		volt.animate();
	}
}

gameLoop();

