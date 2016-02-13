'use strict';

define(function() {
	let i = 0;
	class Unit {
		constructor() {
			this.live = true;
			this.id = i++;
		}

		died() {
			return new DeadUnit(this);
		}
	}

	class DeadUnit extends Unit {
		constructor(unit) {
			super();
			this.army = unit.army;
			this.live = false;
			this.id = unit.id;
		}
	}


	class Army {
		constructor(id, units) {
			this.units = units;
			this.id = id;
			let i = 0;
			this.units.forEach(unit => {
				unit.army = this.id;
				unit.id = i++;
			});
		}
	}

	class Swarm extends Army {
		constructor(units) {
			super('swarm', units);
		}
	}

	class Tribe extends Army {
		constructor(units) {
			super('tribe', units);
		}
	}

	var died = function(armie, unitToDie) {
		return new Army(armie.id, armie.units.map(unit => (unitToDie.id === unit.id) ? unit.died() : unit));
	};

	var fight = function(armies, units) {
		var isArmyAlreadyPresent = ((uniq, unit) => uniq.find(filteredUnit => (filteredUnit.army === unit.army) ? true : false));
		var addIfArmyNotPresented = ((uniq, unit) => isArmyAlreadyPresent(uniq, unit) ? uniq : uniq.concat(unit));
		var unitsFromDifferentArmies = units.reduce((uniq, unit) => addIfArmyNotPresented(uniq, unit), []);

		if (unitsFromDifferentArmies.length > 1) {
			var armiesAfterBattle = unitsFromDifferentArmies.map(unit => died(armies[unit.army], unit));
			return formation(armiesAfterBattle);
		} else {
			return armies;
		}
	};

	var formation = function(armies) {
		var result = armies.reduce((map, armie) => Object.assign(map, {[armie.id]: armie}), {});
		return result;
	};

	return {
		fight: fight,
		initial: formation([
			new Swarm([new Unit(), new Unit()]),
			new Tribe([new Unit(), new Unit(), new Unit()])])
	}
;
});
