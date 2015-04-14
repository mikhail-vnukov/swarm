Swarmlette = function(target, swarm) {
	this.target = target;
	this.swarm = swarm;

	this.wobbler = setupWobble();
	this.acceleration = createVector(0, 0);
	this.velocity = createVector(random(-1, 1), random(-1, 1));
	this.position = createVector(width / 2, height / 2);

	this.r = 1.0;
	this.MAX_SPEED = 10; // Maximum speed
	this.MAX_FORCE = 0.5;
};

function setupWobble() {
	WOBBLE_LIMIT = 10;
	WOBBLE_SPEED = 1;
	return {
		value: random(WOBBLE_LIMIT),
		min: -WOBBLE_LIMIT,
		max: WOBBLE_LIMIT,
		inc: WOBBLE_SPEED,
		update: function() {
			this.value += random(0, this.inc);
			if (this.value >= this.max || this.value <= this.min) {
				this.inc = -this.inc;
			}
		}
	};
}

Swarmlette.prototype.update = function() {

	this.flock(this.swarm);
	this.aim(this.target);

	this.move();

	this.borders();
};

Swarmlette.prototype.wobble = function(first_argument) {
	this.wobbling.update();
	// var theta = this.velocity.heading() + radians(90);

	var theta = this.velocity.heading() + PI/2;
	var wobble = p5.Vector.fromAngle(theta)*this.wobbler.value;
	this.position.add(wobble);
};

Swarmlette.prototype.aim = function(target) {
	var aiming = this.seek(target.position);
	aiming.mult(1.5);
	this.applyForce(aiming);
};

Swarmlette.prototype.move = function() {
	this.velocity.add(this.acceleration);
	// Limit speed
	this.velocity.limit(this.MAX_SPEED);
	this.position.add(this.velocity);
	this.position.add(p5.Vector.random2D().mult(3));
	// this.wobble();

	// Reset acceleretion to 0 each cycle
	this.acceleration.mult(0);
};


Swarmlette.prototype.applyForce = function(force) {
	// We could add mass here if we want A = F / M
	this.acceleration.add(force);
};

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Swarmlette.prototype.seek = function(target) {
	var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
	// Normalize desired and scale to maximum speed
	desired.normalize();
	desired.mult(this.MAX_SPEED);
	// Steering = Desired minus Velocity
	var steer = p5.Vector.sub(desired, this.velocity);
	steer.limit(this.MAX_FORCE); // Limit to maximum steering force
	return steer;
};

// Separation
// Method checks for nearby swarm and steers away
Swarmlette.prototype.separate = function(swarm) {
	var desiredseparation = 25.0;
	var steer = createVector(0, 0);
	var count = 0;
	// For every boid in the system, check if it's too close
	for (var i = 0; i < swarm.length; i++) {
		var d = p5.Vector.dist(this.position, swarm[i].position);
		// If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
		if ((d > 0) && (d < desiredseparation)) {
			// Calculate vector pointing away from neighbor
			var diff = p5.Vector.sub(this.position, swarm[i].position);
			diff.normalize();
			diff.div(d); // Weight by distance
			steer.add(diff);
			count++; // Keep track of how many
		}
	}
	// Average -- divide by how many
	if (count > 0) {
		steer.div(count);
	}

	// As long as the vector is greater than 0
	if (steer.mag() > 0) {
		// Implement Reynolds: Steering = Desired - Velocity
		steer.normalize();
		steer.mult(this.MAX_SPEED);
		steer.sub(this.velocity);
		steer.limit(this.MAX_FORCE);
	}
	return steer;
};

// Alignment
// For every nearby boid in the system, calculate the average velocity
Swarmlette.prototype.align = function(swarm) {
	var neighbordist = 50;
	var sum = createVector(0, 0);
	var count = 0;
	for (var i = 0; i < swarm.length; i++) {
		var d = p5.Vector.dist(this.position, swarm[i].position);
		if ((d > 0) && (d < neighbordist)) {
			sum.add(swarm[i].velocity);
			count++;
		}
	}
	if (count > 0) {
		sum.div(count);
		sum.normalize();
		sum.mult(this.MAX_SPEED);
		var steer = p5.Vector.sub(sum, this.velocity);
		steer.limit(this.MAX_FORCE);
		return steer;
	} else {
		return createVector(0, 0);
	}
};

// Cohesion
// For the average location (i.e. center) of all nearby swarm, calculate steering vector towards that location
Swarmlette.prototype.cohesion = function(swarm) {
	var neighbordist = 50;
	var sum = createVector(0, 0); // Start with empty vector to accumulate all locations
	var count = 0;
	for (var i = 0; i < swarm.length; i++) {
		var d = p5.Vector.dist(this.position, swarm[i].position);
		if ((d > 0) && (d < neighbordist)) {
			sum.add(swarm[i].position); // Add location
			count++;
		}
	}
	if (count > 0) {
		sum.div(count);
		return this.seek(sum); // Steer towards the location
	} else {
		return createVector(0, 0);
	}
};

// We accumulate a new acceleration each time based on three rules
Swarmlette.prototype.flock = function(swarm) {
	var separation = this.separate(swarm);
	var alignment = this.align(swarm);
	var cohesion = this.cohesion(swarm);
	// Arbitrarily weight these forces
	separation.mult(1.5);
	alignment.mult(1.0);
	cohesion.mult(1.0);
	// Add the force vectors to acceleration
	this.applyForce(separation);
	this.applyForce(alignment);
	this.applyForce(cohesion);
};


Swarmlette.prototype.draw = function() {
	// color(255, 255, 255);
	// ellipse(this.position.x, this.position.y, 5, 5);
	// ellipse(this.position.x + this.velocity.x, this.position.y + this.velocity.y, 2, 2);


	// Draw a triangle rotated in the direction of velocity
	var theta = this.velocity.heading() + radians(90);

	this.wobbler.update();
	// var theta = this.velocity.heading() + radians(90);

	var wobble = p5.Vector.fromAngle(theta).normalize().mult(this.wobbler.value);

	fill(127);
	stroke(200);
	push();
	translate(this.position.x + wobble.x, this.position.y + wobble.y);
	rotate(theta);
	beginShape();
	vertex(0, -this.r * 2);
	vertex(-this.r, this.r * 2);
	vertex(this.r, this.r * 2);
	endShape(CLOSE);
	pop();
};


// Wraparound
Swarmlette.prototype.borders = function() {
	if (this.position.x < -this.r) this.position.x = width + this.r;
	if (this.position.y < -this.r) this.position.y = height + this.r;
	if (this.position.x > width + this.r) this.position.x = -this.r;
	if (this.position.y > height + this.r) this.position.y = -this.r;
};

Swarm = function(target) {
	this.swarm = [];
	for (var i = 0; i < 100; i++) {
		this.swarm.push(new Swarmlette(target, this.swarm));
	}
};


Swarm.prototype.update = function() {
	for (var i in this.swarm) {
		this.swarm[i].update();
	}
};


Swarm.prototype.draw = function() {
	for (var i in this.swarm) {
		this.swarm[i].draw();
	}
};
