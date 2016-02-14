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
		constructor(army, id, life, revealed) {
			super(army, id, life);
			this._revealed = revealed | false;
		}

		breed() {
			var lifeAfterBreed = Math.floor(this.life * 1.15);
			return new Grunt(this.army, this.id, lifeAfterBreed, this.revealed);
		}

		get revealed() {
			return this._revealed;
		}

		reveal() {
			return new Grunt(this.army, this.id, this.life, true);
		}

		fight(enemy) {
			var lifeAfterFight = Math.max(this.life - enemy.life, 0);
			var revealed =  (lifeAfterFight <= 0) || this.revealed;
			return new Grunt(this.army, this.id, lifeAfterFight, revealed);
		}
	}

	class Army {

		static create(id, size) {
			return new Army(id, times(size, (i) =>
				new Unit(id, i, Math.floor(Math.random()*100))));
		}

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
				new Drone(SWARM_ID, i, Math.floor(Math.random()*100))));
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
			if (id === unit.army) {
				return armies[id].update(unit.reveal()).breed();
			} else {
				return armies[id].breed();
			}
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
