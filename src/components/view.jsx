'use strict';

var React = require('react');
require('normalize.css');
require('../styles/main.css');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var AppDispatcher = require('../dispatcher/dispatch');

// var imageURL = require('../images/yeoman.png');

var View = React.createClass({
	fight: function() {
		AppDispatcher.dispatch({actionType:'fight', 'board': this.props.board});
	},
	render: function() {
		return (
			<div>
				<Swarm army={this.props.board.armies.swarm}/>
				<Tribe class="tribe" army={this.props.board.armies.tribe}/>
				<FightButton onClick={this.fight}/>
			</div>
		);
	}
});

var FightButton = React.createClass({
	clickHandler: function(){
		this.props.onClick();
	},

	render: function() {
		return (
			<button onClick={this.clickHandler}>fight</button>
		);
	}
});

var Swarm = React.createClass({
	render: function() {
		let i = 0;

		return (
			<div>
				<p>Swarm</p>
				{this.props.army.units.map(function(unit) {
					var j = i++;

					return <UnitView key={j}  unit={unit}/>;
				})}
			</div>
		);
	}
});

var Tribe = React.createClass({
	render: function() {
		let i = 0;

		return (
			<div>

				<p>Tribe</p>
				{this.props.army.units.map(function(unit) {
					var j = i++;
					return <UnitView key={j} unit={unit} />;
				})}
			</div>
		);
	}
});

var UnitView = React.createClass({
	click() {
		AppDispatcher.dispatch({'actionType': 'selected', 'unit': this.props.unit});
	},

	render() {
		return <p onClick={this.click} >{this.props.unit.live ? 'live' : 'dead'}</p>;
	}
});


module.exports = View;

