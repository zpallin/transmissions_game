////////////////////////////////////////////////////////////////////////////////
// player object

var tracks_raw = [
	[{x: 0, y: 590}, {x: 600, y: 590}],
	[{x: 510.0, y: 490.0}, {x: 600.0, y: 490.0}],
	[{x: 404.0, y: 560.0}, {x: 504.0, y: 560.0}],
	[{x: 370.0, y: 536.0}, {x: 388.0, y: 536.0}],
	[{x: 354.0, y: 414.0}, {x: 404.0, y: 414.0}],
	[{x: 330.0, y: 560.0}, {x: 354.0, y: 560.0}],
	[{x: 246.0, y: 544.0}, {x: 322.0, y: 544.0}],
	[{x: 246.0, y: 526.0}, {x: 322.0, y: 526.0}],
	[{x: 232.0, y: 490.0}, {x: 330.0, y: 490.0}],
	[{x: 192.0, y: 532.0}, {x: 232.0, y: 532.0}],
	[{x: 162.0, y: 490.0}, {x: 190.0, y: 490.0}],
	[{x: 108.0, y: 414.0}, {x: 160.0, y: 414.0}],
	[{x: 70.0, y: 386.0}, {x: 71.0, y: 350.0}],
	[{x: 80.0, y: 360.0}, {x: 81.0, y: 346.0}]
];

/*
	[{x: 316.0, y: 544.0}, {x: 322.0, y: 544.0}],
	[{x: 298.0, y: 544.0}, {x: 304.0, y: 544.0}],
	[{x: 284.0, y: 544.0}, {x: 278.0, y: 544.0}],
	[{x: 266.0, y: 544.0}, {x: 258.0, y: 544.0}],
	[{x: 246.0, y: 544.0}, {x: 240.0, y: 544.0}],
*/
/*
	[508.0,472.0],
	[404.0,560.0],
	[396.0,330.0],
	[166.0,470.0],
	[84.0,330.0],
	[90.0,424.0],
	[66.0,410.0],
	[80.0,396.0],
	[76.0,378.0],
	[68.0,370.0],
*/

function standardLeftRightKeys() {
	return {
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
	};
}

function Player(entity) {
	this.entity = entity;
	for (var idx in tracks_raw) {
		var track = tracks_raw[idx];
		console.log("TRACK : " + JSON.stringify(track));
		var dis = this;
		this.entity.tmgr.addTrack(new Track(
			{ x: 0, y: 0 },
			track,
			standardLeftRightKeys(),
			0.1
		));

		
		this.entity.tmgr.lastTrack().events = function(tmgr) {
				var track = tmgr.current();
				console.log("BOUND: " + dis.entity.pos.x + " : " + track.bound[1].x);
				if (dis.entity.pos.x >= track.bound[1].x) {
					dis.entity.resetPos();
					tmgr.nextTrack();
				}
			}
	}
}

Player.prototype.translate = function(translate) {
	this.translate = translate;
}
