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

		fight(enemy) {
			var lifeAfterFight = Math.max(this.life - enemy.life, 0);
			return new Unit(this.army, this.id, lifeAfterFight);
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

	class Army {

		static create(id, size) {
			return new Army(id, times(size, (i) =>
				new Unit(id, i, Math.floor(Math.random()*100))));
		}

		constructor(id, units) {
			this._id = id;
			this._units = units;
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

	class Swarm extends Army {
		static create(size) {
			return Army.create('swarm', size);
		}
	}

	class Tribe extends Army {
		static create(size) {
			return Army.create('tribe', size);
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

		return formation([army1, army2]);
	};

	var formation = function(armies) {
		return armies.reduce((map, armie) =>
			Object.assign(map, {[armie.id]: armie}), {});
	};

	return {
		fight: fight,
		initial: formation([
			Swarm.create(2),
			Tribe.create(3)])
	}
;
});
