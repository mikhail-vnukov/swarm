var Target = function (argument) {
	this.position = createVector(1, 120);
};

function setup() {
	createCanvas(800, 600);
	this.target = new Target();
	this.swarm = new Swarm(this.target);
}

function draw() {
	background(0, 0, 0);
	this.target.position.set(mouseX, mouseY);
	this.swarm.update();
	this.swarm.draw();
}

