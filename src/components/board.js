var fight = require('./army').fight;

var Board = function(armies) {
	this.armies = armies;
};

Board.prototype.fight = function() {
	return new Board(fight(this.armies));
};

module.exports = Board;