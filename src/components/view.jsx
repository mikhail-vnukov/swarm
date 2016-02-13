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

	_fight: function() {
		AppDispatcher.dispatch({
			actionType: 'fight'
		});
	},

	render: function() {
		return (
			<div>
				<Swarm army={this.state.armies.swarm} selected={this.state.selected} />
				<Tribe class="tribe" army={this.state.armies.tribe} selected={this.state.selected}/>
				<FightButton onClick={this.fight}/>

				{(() => {
					if (this.state.selected) {
						return <p>{this.state.selected.id}:{this.state.selected.army}</p>;
					}
				})()}
			</div>
		);
	}
});

var FightButton = React.createClass({
	clickHandler: function() {
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
		var isArmySelected = (this.props.selected != undefined)
			&& (this.props.selected.army === this.props.army.id);
			var selectedId = isArmySelected ? this.props.selected.id : undefined;

		return (
			<div>
				<p>Swarm</p>
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

var Tribe = React.createClass({
	render: function() {
		var isArmySelected = (this.props.selected != undefined)
			&& (this.props.selected.army === this.props.army.id);
		var selectedId = isArmySelected ? this.props.selected.id : undefined;
		return (
			<div>
				<p>Tribe</p>
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
		return (
			<p style={{color: color}} onClick={this.props.unit.live ? this.click : null } >
				{this.props.unit.live ? 'live' : 'dead'}
			</p>
		);
	}
});


module.exports = View;
