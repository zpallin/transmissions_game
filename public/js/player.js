////////////////////////////////////////////////////////////////////////////////
// player object

function Player(entity) {
	this.entity = entity;
}

Player.prototype.translate = function(translate) {
	this.translate = translate;
}
