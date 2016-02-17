'use strict';

var times = function(n, iterator) {
	var accum = new Array(Math.max(0, n));
	for (var i = 0; i < n; i++) accum[i] = iterator.call(null, i);
	return accum;
};

define(function() {
	class Unit {
		constructor(army, id, life) {
			this._army = army;
			this._id = id;
			this._life = life;
		}

		fight() {
			return this;
		}

		breed() {
			return this;
		}

		reveal() {
			return this;
		}

		get army() {
			return this._army;
		}

		get id() {
			return this._id;
		}

		get life() {
			return this._life;
		}

		get display() {
			return this._life;
		}
	}

	class Drone extends Unit {
		constructor(army, id, life) {
			super(army, id, life);
		}

		fight(enemy) {
			var lifeAfterFight = (this.life - enemy.life < 0) ? 0 : (this.life + enemy.life);
			return new Drone(this.army, this.id, lifeAfterFight);
		}
	}

	class Grunt extends Unit {

		constructor(army, id, life, display) {
			super(army, id, life);
			this._display = (display === undefined) ? 'XXX' : display;
		}

		_generateDisplay(life) {
			var basis = Math.random()*5 + 2; //2-7
			var halfRange = life/(basis*2); // from (life/5) - to (life/10)
			var lowest = Math.floor((life - halfRange) + Math.random()*halfRange);
			var highest = Math.ceil(lowest + halfRange*2);
			if (lowest === highest) {
				return life;
			} else {
				return lowest + '-' + highest;
			}

		}

		breed() {
			var lifeAfterBreed = Math.floor(this.life * 1.15);
			return new Grunt(this.army, this.id, lifeAfterBreed, this.display);
		}

		get display() {
			return this._display;
		}

		get life() {
			return this._life;
		}

		fight(enemy) {
			var lifeAfterFight = Math.max(this.life - enemy.life, 0);
			var revealedLife = this._generateDisplay(lifeAfterFight);
			return new Grunt(this.army, this.id, lifeAfterFight, revealedLife);
		}
	}

	class Army {
		constructor(id, units) {
			this._id = id;
			this._units = units;
		}

		breed() {
			var breedUnits = function(units) {
				return units.map(unit => unit.breed());
			};
			return new Army(this.id, breedUnits(this.units));
		}

		update(updatedUnit) {
			var updateUnits = ((updatedUnit) =>
				this.units.map(unit =>
					(updatedUnit.id === unit.id) ? updatedUnit : unit));

			return new Army(this.id, updateUnits(updatedUnit));
		}

		get id() {
			return this._id;
		}

		get units() {
			return this._units;
		}
	}

	const SWARM_ID = 'swarm';
	const TRIBE_ID = 'tribe';

	class Swarm extends Army {
		static create(size) {
			return new Army(SWARM_ID, times(size, (i) =>
				new Drone(SWARM_ID, i, Math.floor(Math.random()*70))));
		}
	}

	class Tribe extends Army {
		static create(size) {
			return new Army(TRIBE_ID, times(size, (i) =>
				new Grunt(TRIBE_ID, i, Math.floor(Math.random()*100))));
		}
	}

	var unitsFight = function(unit1, unit2) {
		return [unit1.fight(unit2), unit2.fight(unit1)];
	};

	var fight = function(armies, unit1, unit2) {
		if (unit1.army === unit2.army) {
			return armies;
		}

		var army1 = armies[unit1.army];
		var army2 = armies[unit2.army];

		var [veteran1, veteran2] = unitsFight(unit1, unit2);

		army1 = army1.update(veteran1);
		army2 = army2.update(veteran2);

		army1 = army1.breed();
		army2 = army2.breed();

		return formation([army1, army2]);
	};

	var reveal = function(armies, unit) {

		return formation(Object.keys(armies).map(id => {
			var army = armies[id].breed();
			if (id === unit.army) {
				var bredUnit = armies[id].units[unit.id];
				army = army.update(bredUnit.reveal());
			}
			return army;
		}));
	};

	var formation = function(armies) {
		return Object.freeze(armies.reduce((map, armie) =>
			Object.assign(map, {[armie.id]: armie}), {}));
	};

	return {
		fight: fight,
		reveal: reveal,
		initial: formation([
			Swarm.create(3),
			Tribe.create(3)])
	}
;
});
