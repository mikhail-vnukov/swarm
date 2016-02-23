'use strict';

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

	const SWARM_ID = 'swarm';
	const TRIBE_ID = 'tribe';

	class Drone extends Unit {
		constructor(id, life) {
			super(SWARM_ID, id, life);
		}

		fight(enemy) {
			var lifeAfterFight = (this.life - enemy.life < 0) ? 0 : (this.life + enemy.life);
			return new Drone(this.id, lifeAfterFight);
		}
	}

	class Grunt extends Unit {

		constructor(id, life, display, justFought) {
			super(TRIBE_ID, id, life, justFought);
			this._display = (display === undefined) ? this._maskedLife() : display;
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
			if (this._justFought) {
				return new Grunt(this.id, this._life, this._display);
			}
			var lifeAfterBreed = Math.floor(this.life * 1.15);
			// var displayAfterBreed = this._maskedLife();
			return new Grunt(this.id, lifeAfterBreed, this._display);
		}

		_maskedLife() {
			var masked = 'X';
			if (this._life >= 10) {
				masked += 'X';
			}
			if (this._life >= 50) {
				masked += 'X';
			}
			if (this._life >= 100) {
				masked += 'X';
			}
			return masked;
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
			return new Grunt(this.id, lifeAfterFight, revealedLife, true);
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

	class Swarm extends Army {
		static create(sizes) {
			let i = 0;
			return new Army(SWARM_ID, sizes.map(size => new Drone(i++, size)));
		}
	}

	class Tribe extends Army {
		static create(sizes) {
			let i = 0;
			return new Army(TRIBE_ID, sizes.map(size => new Grunt(i++, size)));
		}
	}

	var unitsFight = function(unit1, unit2) {
		return [unit1.fight(unit2), unit2.fight(unit1)];
	};

	var fight = function(swarm, tribe, drone, grunt) {
		var [vetDrone, vetGrunt] = unitsFight(drone, grunt);

		swarm = swarm.update(vetDrone);
		tribe = tribe.update(vetGrunt);

		swarm = swarm.breed();
		tribe = tribe.breed();

		return [swarm, tribe];
	};

	var pick = function(swarm) {
		var units = swarm.units.slice();
		var firstUnit = units.splice(0, 1)[0];
		if (firstUnit.life <= 1) {
			return swarm;
		}
		units = [].concat(
			new Drone(firstUnit.id, firstUnit.life-1),
			units,
			new Drone(units.length+2, 1));
		return new Army(swarm.id, units);
	};

	var formation = function(armies) {
		return Object.freeze(armies.reduce((map, armie) =>
			Object.assign(map, {[armie.id]: armie}), {}));
	};

	var swarm = Swarm.create([4]);
	var tribe = Tribe.create([1, 1, 1, 5, 5, 5, 10, 15, 20, 38]);

	return {
		fight: fight,
		pick: pick,
		initial: formation([swarm, tribe])
	}
;
});
