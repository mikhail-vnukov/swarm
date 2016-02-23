var AppDispatcher = require('../dispatcher/dispatch');
var EventEmitter = require('events').EventEmitter;
var fight = require('./army').fight;



var CHANGE_EVENT = 'change';

var Board = Object.assign({}, EventEmitter.prototype, {

	reset: function() {
		this._swarm = require('./army').initial.swarm;
		this._tribe = require('./army').initial.tribe;
		this._selected = undefined;
	},

	getState: function() {
		return {
			swarm: Board._swarm,
			tribe: Board._tribe,
			selected: Board._selected
		};
	},

	getSelected: function() {
		return Board._selected;
	},

	emitChange: function() {
		Board.emit(CHANGE_EVENT);
	},

	addChangeListener: function(callback) {
		Board.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function(callback) {
		Board.removeListener(CHANGE_EVENT, callback);
	}
});

AppDispatcher.register(function(action) {
	switch (action.actionType) {
	case 'selected':
		if(action.unit.army === 'tribe') {
			if (Board._selected) {
				[Board._swarm, Board._tribe] = fight(Board._swarm, Board._tribe, Board._selected, action.unit);
				Board._selected = undefined;
			}
		} else {
			Board._selected = action.unit;
		}
		break;
	case 'reset':
		Board.reset();
		break;
	}

	Board.emitChange();
});

Board.reset();

module.exports = Board;
