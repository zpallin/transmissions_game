
function generatePedestrians(loader, stage) {
	var peds = [];

	for (var i = 5; i < 8; i++) {
		var num = i - 3;
		var newPed = new Entity('C'+(num), stage, {size: 0.5});
		newPed.addAnimation(
			"run",
			"C"+i+"-",
			".png",
			3
		);
		newPed.addAnimation(
			"idle",
			"C"+i+"-",
			".png",
			1
		);
		newPed.tmgr.addTrack(new Track(
		  { x: Math.random() * 500 + 50, y: 0 },
		  [ {x: 0, y: 585}, {x: 600, y: 585}],
			{},
			11,
			function() {
//				var transX = newPed.getTrans().x;	
				console.log(newPed.name + ": " + newPed.pos.x);
				if (newPed.pos.x < 20 + newPed.pos.x) {
					newPed.pos.x = 520;
					console.log("teleport right!" + JSON.stringify(newPed.pos));
				}

				if (newPed.pos.x > 550 + newPed.pos.x) {
					newPed.pos.x = 50;
					console.log("teleport left!" + JSON.stringify(newPed.pos));
				}
			}
		));
		var direction = 0;
		if (Math.round(Math.random()) === 0) {
			newPed.move.right = true;
			direction = 1;
		} else {
			newPed.move.left = true;
			direction = -1;
		}
		newPed.setAnimation("run", 0.1, {x : 0});

		peds.push(newPed);
	} 

	//return peds;
}
