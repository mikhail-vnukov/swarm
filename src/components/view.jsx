'use strict';

require('normalize.css');
require('../styles/main.css');

var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var AppDispatcher = require('../dispatcher/dispatch');
var Board = require('./board');

// var imageURL = require('../images/yeoman.png');

var View = React.createClass({

	getInitialState: function() {
		return Board.getState();
	},

	componentDidMount: function() {
		Board.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		Board.removeChangeListener(this._onChange);
	},

	_onChange: function() {
		this.setState(Board.getState());
	},

	_reset: function() {
		AppDispatcher.dispatch({
			actionType: 'reset'
		});
	},

	render: function() {
		return (
			<div>
				<Swarm army={this.state.armies.swarm} selected={this.state.selected} />
				<Tribe class="tribe" army={this.state.armies.tribe} selected={this.state.selected}/>
				<button onClick={this._reset}>reset</button>

				{(() => {
					if (this.state.selected) {
						return <p>{this.state.selected.id}:{this.state.selected.army}</p>;
					}
				})()}
			</div>
		);
	}
});

var Swarm = React.createClass({
	render: function() {
		return (
			<Army name='Swarm' army={this.props.army} selected={this.props.selected} />
		);
	}
});

var Tribe = React.createClass({
	render: function() {
		return (
			<Army name='Tribe' army={this.props.army} selected={this.props.selected} />
		);
	}
});

var Army = React.createClass({
	render: function() {
		var isArmySelected = (this.props.selected != undefined)
			&& (this.props.selected.army === this.props.army.id);
		var selectedId = isArmySelected ? this.props.selected.id : undefined;
		return (
			<div>
				<p>{this.props.name}</p>
				{this.props.army.units.map(function(unit) {
					return <UnitView
						key={unit.id}
						unit={unit}
						selected={unit.id === selectedId}/>;
				})}
			</div>
		);
	}
});

var UnitView = React.createClass({
	click() {
		AppDispatcher.dispatch({
			'actionType': 'selected',
			'unit': this.props.unit
		});
	},
	//
	render: function() {
		var color = this.props.selected ? 'red': 'black';
		var isAlive = this.props.unit.life > 0;
		return (
			<p style={{color: color}} onClick={isAlive ? this.click : null } >
				{this.props.unit.life}
			</p>
		);
	}
});


module.exports = View;
