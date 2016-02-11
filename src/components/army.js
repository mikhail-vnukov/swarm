'use strict';

define(function() {
	class Unit {
		constructor() {
			this.live = true;
		}

		die() {
			return new DeadUnit(this);
		}
	}

	class DeadUnit extends Unit {
		constructor(unit) {
			super();
			this.army = unit.army;
			this.live = false;
		}
	}

	var unit11 = new Unit();
	var unit12 = new Unit();
	var unit21 = new Unit();
	var unit22 = new Unit();
	var unit23 = new Unit();

	class Army {
		constructor(id, units) {
			this.units = units;
			this.id = id;
			this.units.forEach(unit => unit.army = this.id);
		}
	}

	class Swarm extends Army {
		constructor(units) {
			super(1, units);
		}
	}

	class Tribe extends Army {
		constructor(units) {
			super(2, units);
		}
	}

	Army.fight = function(armies) {
		var units1 = armies.swarm.units;
		var units2 = armies.tribe.units;
		var swarmUnits = units1.
			slice(0, units2.length).
			map(unit => unit.die()).
			concat(units1.slice(units2.length));
		var tribeUnits = units2.
			slice(0, units1.length).
			map(unit => unit.die()).
			concat(units2.slice(units1.length));

		return {
			'swarm': new Swarm(swarmUnits),
			'tribe': new Tribe(tribeUnits)
		};
	};

	return {
		fight: Army.fight,
		initial: {
			'swarm': new Swarm([unit11, unit12]),
			'tribe': new Tribe([unit22, unit21, unit23])
		}
	}
;
});
