Swarmlette = function(target, swarm) {
	this.target = target;
	this.swarm = swarm;

	this.SPEED = 4; // missile speed pixels/second
	this.TURN_RATE = radians(4); // turn rate in degrees/frame

	this.WOBBLE_LIMIT = 25; // degrees
	this.WOBBLE_SPEED = 2; // degrees in frame

	this.WIDTH = 3;
	this.AVOID_DISTANCE = this.WIDTH*2; // pixels


	this.wobbler = setupWobble({
		value: random(this.WOBBLE_LIMIT),
		min: -this.WOBBLE_LIMIT,
		max: this.WOBBLE_LIMIT,
		inc: this.WOBBLE_SPEED
	});

	this.velocity = createVector(0, 0);
	this.position = createVector(0, 0);
	this.rotation = 0;
};


function setupWobble(wobbler) {
	wobbler.update = function() {
		this.value += random(0, this.inc);
		if (this.value >= this.max || this.value <= this.min) {
			this.inc = -this.inc;
		}
	};
	return wobbler;
}

Swarmlette.prototype.aimTarget = function(argument) {
	return Math.atan2(
			this.target.position.y - this.position.y,
			this.target.position.x - this.position.x);
};
Swarmlette.prototype.wobble = function() {
	this.wobbler.update();
	return radians(this.wobbler.value);
};

Swarmlette.prototype.avoidOthers = function(first_argument) {

	// Make each missile steer away from other missiles.
	// Each missile knows the group that it belongs to (missileGroup).
	// It can calculate its distance from all other missiles in the group and
	// steer away from any that are too close. This avoidance behavior prevents
	// all of the missiles from bunching up too tightly and following the
	// same track.
	for (var i in this.swarm) {
		var bee = this.swarm[i];
		if (this == bee) continue;

		var distance = this.position.dist(bee.position);

		// If the missile is too close...
		if (distance < this.AVOID_DISTANCE) {
			// Chose an avoidance angle of 90 or -90 (in radians)
			avoidAngle = Math.PI / 2;
			return avoidAngle;
			// return (Math.random() < 0.5) ? avoidAngle : -avoidAngle;
		}
	}

	return 0;
};

Swarmlette.prototype.rotate = function(targetAngle) {
	// Gradually (this.TURN_RATE) aim the missile towards the target angle
	if (this.rotation !== targetAngle) {
		// Calculate difference between the current angle and targetAngle
		var delta = targetAngle - this.rotation;

		// Keep it in range from -180 to 180 to make the most efficient turns.
		if (delta > Math.PI) delta -= Math.PI * 2;
		if (delta < -Math.PI) delta += Math.PI * 2;

		if (delta > 0) {
			// Turn clockwise
			this.rotation += this.TURN_RATE;
		} else {
			// Turn counter-clockwise
			this.rotation -= this.TURN_RATE;
		}

		// Just set angle to target angle if they are close
		if (Math.abs(delta) < this.TURN_RATE) {
			this.rotation = targetAngle;
		}
	}
};

Swarmlette.prototype.update = function() {
	var targetAngle = this.aimTarget();
	targetAngle += this.wobble();
	targetAngle += this.avoidOthers();
	this.rotate(targetAngle);

	this.velocity = p5.Vector.fromAngle(this.rotation).mult(this.SPEED);

	this.position.add(this.velocity);
};

Swarmlette.prototype.draw = function() {
	color(255, 255, 255);
	ellipse(this.position.x, this.position.y, 5, 5);
	ellipse(this.position.x+this.velocity.x, this.position.y+this.velocity.y, 2, 2);

};


Swarm = function(target) {
	this.swarm = [];
	for (var i = 0; i < 100; i++) {
		this.swarm.push(new Swarmlette(target, this.swarm));
	}
};


Swarm.prototype.update = function() {
	for(var i in this.swarm) {
		this.swarm[i].update();
	}
};


Swarm.prototype.draw = function() {
	for(var i in this.swarm) {
		this.swarm[i].draw();
	}
};
