'use strict';

var View = require('./view');
var React = require('react');
var ReactDOM = require('react-dom');
var armies = require('./army').initial;
var Board = require('./board');
var AppDispatcher = require('../dispatcher/dispatch');

AppDispatcher.register(function(action) {
	switch (action.actionType) {
	case 'fight':
		rerender(action.board.fight());
	}
});

var content = document.getElementById('content');

function rerender(board) {
	ReactDOM.render( <View board = {board} />, content);
}

rerender(new Board(armies));
