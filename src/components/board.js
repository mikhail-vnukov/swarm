var AppDispatcher = require('../dispatcher/dispatch');
var EventEmitter = require('events').EventEmitter;
var fight = require('./army').fight;



var CHANGE_EVENT = 'change';

var Board = Object.assign({}, EventEmitter.prototype, {
	_armies: require('./army').initial,
	_selected: undefined,

	getState: function() {
		return {
			armies: Board._armies,
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
		if (Board._selected) {
			Board._armies = fight(Board._armies, Board._selected, action.unit);
			Board._selected = undefined;
		} else {
			Board._selected = action.unit;
		}
		break;
	}
	Board.emitChange();
});

module.exports = Board;
