Swarmlette = function(target) {
	this.target = target;

	this.SPEED = 7; // missile speed pixels/second
	this.TURN_RATE = radians(5); // turn rate in degrees/frame

	this.WOBBLE_LIMIT = 25; // degrees
	this.WOBBLE_SPEED = 4; // degrees in frame

	this.SMOKE_LIFETIME = 3000; // milliseconds
	this.AVOID_DISTANCE = 30; // pixels


	this.wobbler = setupWobble({
		value: random(this.WOBBLE_LIMIT),
		min: -this.WOBBLE_LIMIT,
		max: this.WOBBLE_LIMIT,
		inc: this.WOBBLE_SPEED
	});

	this.velocity = createVector(0, 0);
	this.position = createVector(random(200), random(200));
	this.rotation = 0;
};


function setupWobble(wobbler) {
	wobbler.update = function() {
		this.value += this.inc;
		if (this.value >= this.max || this.value <= this.min) {
			this.inc = -this.inc;
		}
	};
	return wobbler;
}


Swarmlette.prototype.update = function() {
	var targetAngle = Math.atan2(
		this.target.position.y - this.position.y,
		this.target.position.x - this.position.x);

	this.wobbler.update(frameCount);

	targetAngle += radians(this.wobbler.value);
	console.log("wobber: " + this.wobbler.value);
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

	// this.rotation = targetAngle;

	// this.velocity = p5.Vector.fromAngle(this.rotation).mult(this.SPEED);
	this.velocity.x = Math.cos(this.rotation) * this.SPEED;
	this.velocity.y = Math.sin(this.rotation) * this.SPEED;

	this.position.add(this.velocity);
};

Swarmlette.prototype.draw = function() {
	color(255, 255, 255);
	ellipse(this.position.x, this.position.y, 30, 30);
	ellipse(this.position.x+this.velocity.x*5, this.position.y+this.velocity.y*5, 15, 15);

};


Swarm = function(target) {
	this.swarm = [];
	for (var i = 0; i < 1; i++) {
		this.swarm.push(new Swarmlette(target));
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
