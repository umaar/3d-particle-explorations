const ParticleBase = require('../particle-base');
const Osc = require('../utils/osc');

class Particle extends ParticleBase {

	constructor(config, system, loader) {
		super(config, system, loader);

		this.prog = config.prog;
		this.alt = config.alt;
		this.index = config.index;
		this.radius = config.radius;
		this.osc1 = new Osc(1 - this.prog / 6, 0.015, true, false);
		this.createTail();
		this.createHead();
	}

	reset() {
		super.reset();
		this.osc1 = new Osc(1 - this.prog / 6, 0.015, true, false);
	}

	createMesh() {
		this.object3D = new THREE.Object3D();
		this.group.add(this.object3D);
	}

	createTail() {
		this.cAngle = this.calc.rand(Math.PI / 8, Math.PI / 3);
		this.curve = new THREE.EllipseCurve(
			0,
			0,
			this.radius,
			this.radius,
			0,
			this.cAngle,
			false,
			0
		);

		this.cPoints = this.curve.getPoints(10);
		this.cGeometry = new THREE.BufferGeometry().setFromPoints(this.cPoints);

		this.cMaterial = new THREE.LineBasicMaterial({
			color: this.color,
			transparent: true,
			opacity: ((this.radius) / this.system.outer) * 1
		});

		this.cMesh = new THREE.Line(this.cGeometry, this.cMaterial);

		this.object3D.add(this.cMesh);
	}

	createHead() {
		this.pGeometry = new THREE.SphereBufferGeometry(1, 12, 12);

		this.pMaterial = new THREE.MeshBasicMaterial({
			color: this.color,
			transparent: true,
			opacity: this.opacity,
			depthTest: false,
			precision: 'lowp',
			side: THREE.DoubleSide
		});

		this.pMesh = new THREE.Mesh(this.pGeometry, this.pMaterial);

		this.pMesh.position.x = this.x;
		this.pMesh.position.y = this.y;
		this.pMesh.position.z = this.z;

		this.pMesh.scale.set(this.size, this.size, this.size);

		this.object3D.add(this.pMesh);
	}

	update() {
		this.osc1.update();

		let val = this.osc1.val(this.ease.inOutExpo);
		this.angle = Math.PI / 2 + (this.index % 3) * ((Math.PI * 2) / 3) + val * ((Math.PI * 6) / 3);
		this.angle += this.osc1.val(this.ease.inOutExpo) * (Math.PI / 3);
		this.pMesh.position.x = Math.cos(this.angle) * this.radius;
		this.pMesh.position.y = Math.sin(this.angle) * this.radius;

		this.cMesh.rotation.z = this.angle - (this.cAngle * (1-this.osc1.val(this.ease.inOutExpo)));
	}

}

module.exports = Particle;
