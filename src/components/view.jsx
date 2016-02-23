'use strict';

require('normalize.css');
require('../styles/main.css');

var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var AppDispatcher = require('../dispatcher/dispatch');
var Board = require('./board');
var classnames = require('classnames');

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

	_pick: function() {
		AppDispatcher.dispatch({
			actionType: 'pick'
		});
	},

	render: function() {
		return (
			<div>
				<Swarm army={this.state.swarm} selected={this.state.selected} />
				<Tribe class="tribe" army={this.state.tribe} selected={this.state.selected}/>
				<button onClick={this._reset}>reset</button>
				<button onClick={this._pick}>pick</button>

				{(() => {
					if (this.state.selected) {
						return <p>{this.state.selected.id}:{this.state.selected.army}</p>;
					}
				})()}
			</div>
		);
	}
});

var Selection = {
	componentWillReceiveProps(nextProps) {
		var isArmySelected = (nextProps.selected != undefined)
			&& (nextProps.selected.army === nextProps.army.id);
		this.setState({selectedId: (isArmySelected ? nextProps.selected.id : undefined)});
	}
};


var Swarm = React.createClass({
	mixins: [Selection],

	render: function() {
		var selectedId = this.state ? this.state.selectedId : undefined;
		return (
			<div>
				<p>Swarm</p>
				{this.props.army.units.map(function(unit) {
					return <DroneView
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
		return (
			<div>
				<p>Tribe</p>
				{this.props.army.units.map(function(unit) {
					return <GruntView
						key={unit.id}
						unit={unit} />;
				})}
			</div>
		);
	}
});

var DroneView = React.createClass({
	click() {
		AppDispatcher.dispatch({
			'actionType': 'selected',
			'unit': this.props.unit
		});
	},

	render: function() {
		var color = this.props.selected ? 'red': 'black';
		var isClickable = this.props.unit.life > 0;
		var classes = classnames('drone',
			{selected: this.props.selected}, {clickable: isClickable});
		return (
			<p className={classes} onClick={isClickable ? this.click : null } >
				{this.props.unit.life}
			</p>
		);
	}
});

var GruntView = React.createClass({
	click() {
		AppDispatcher.dispatch({
			'actionType': 'selected',
			'unit': this.props.unit
		});
	},

	render: function() {
		var isClickable = (this.props.unit.life > 0) && !this.props.unit.revealed;
		var classes = classnames('grunt', {
			clickable: isClickable
		});
		return (
			<p className={classes} onClick={isClickable ? this.click : null } >
				{this.props.unit.display}
			</p>
		);
	}
});


module.exports = View;
