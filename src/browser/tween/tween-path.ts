import * as PIXI from 'pixi.js';

export class TweenPath {
	_closed = false;
	polygon = new PIXI.Polygon();
	currentPath: any = null;
	graphicsData: any = [];
	dirty = true;

	private tmpPoint = new PIXI.Point();
	private tmpPoint2 = new PIXI.Point();
	private tmpDistance: any[] = [];

	constructor() {
		this.polygon.closed = true;
	}

	get closed() { return this._closed;	}

	set closed(value) {
		if (this._closed === value) return;
		this.polygon.closed = value;
		this._closed = value;
		this.dirty = true;
	}

	get length() {
		return this.polygon.points.length
			? (this.closed ? 1 : 0) + this.polygon.points.length / 2
			: 0
		;
	}

	moveTo(x: number, y: number) {
		PIXI.Graphics.prototype.moveTo.call(this, x, y);
		this.dirty = true;
		return this;
	}

	lineTo(x: number, y: number) {
		PIXI.Graphics.prototype.lineTo.call(this, x, y);
		this.dirty = true;
		return this;
	}

	bezierCurveTo(cpX: number, cpY: number, cpX2: number, cpY2: number, toX: number, toY: number) {
		PIXI.Graphics.prototype.bezierCurveTo.call(this, cpX, cpY, cpX2, cpY2, toX, toY);
		this.dirty = true;
		return this;
	}

	quadraticCurveTo(cpX: number, cpY: number, toX: number, toY: number) {
		PIXI.Graphics.prototype.quadraticCurveTo.call(this, cpX, cpY, toX, toY);
		this.dirty = true;
		return this;
	}

	arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
		PIXI.Graphics.prototype.arcTo.call(this, x1, y1, x2, y2, radius);
		this.dirty = true;
		return this;
	}

	arc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number, anticlockwise: number) {
		PIXI.Graphics.prototype.arc.call(this, cx, cy, radius, startAngle, endAngle, anticlockwise);
		this.dirty = true;
		return this;
	}

	drawShape(shape: PIXI.Circle | PIXI.Rectangle | PIXI.Ellipse | PIXI.RoundedRectangle | PIXI.Polygon) {
		PIXI.Graphics.prototype.drawShape.call(this, shape);
		this.dirty = true;
		return this;
	}

	getPoint(num: number) {
		this.parsePoints();
		const len = this.closed && num >= this.length - 1 ? 0 : num * 2;
		this.tmpPoint.set(this.polygon.points[len], this.polygon.points[len + 1]);
		return this.tmpPoint;
	}

	distanceBetween(num1: number, num2: number) {
		this.parsePoints();
		const { x: p1X, y: p1Y } = this.getPoint(num1);
		const { x: p2X, y: p2Y } = this.getPoint(num2);
		const dx = p2X - p1X;
		const dy = p2Y - p1Y;
		return Math.sqrt(dx * dx + dy* dy);
	}

	totalDistance() {
		this.parsePoints();
		this.tmpDistance.length = 0;
		this.tmpDistance.push(0);
		let distance = 0;
		const n = this.length - 1;
		for(let i = 0; i < n; i++) {
			distance += this.distanceBetween(i, i + 1);
			this.tmpDistance.push(distance);
		}
		return distance;
	}

	getPointAt(num: number) {
		this.parsePoints();
		if (num > this.length) {
			return this.getPoint(this.length - 1);
		}

		if (num % 1 === 0) {
			return this.getPoint(num);
		} else {
			this.tmpPoint2.set(0, 0);
			let diff = num % 1;
			let { x: ceilX, y: ceilY } = this.getPoint(Math.ceil(num));
			let { x: floorX, y: floorY } = this.getPoint(Math.floor(num));
			let xx = -((floorX - ceilX) * diff);
			let yy = -((floorY - ceilY) * diff);
			this.tmpPoint2.set(floorX + xx, floorY + yy);
			return this.tmpPoint2;
		}
	}

	getPointAtDistance(distance: number) {
		this.parsePoints();
		if (!this.tmpDistance) this.totalDistance();
		let len = this.tmpDistance.length;
		let n = 0;
		let totalDistance = this.tmpDistance[this.tmpDistance.length - 1];
		if (distance < 0) {
			distance = totalDistance + distance;
		} else if (distance > totalDistance) {
			distance = distance-totalDistance;
		}
		for (let i = 0; i < len; i++) {
			if (distance >= this.tmpDistance[i]) {
				n = i;
			}
			if (distance < this.tmpDistance[i]) break;
		}
		if (n === this.length - 1) {
			return this.getPointAt(n);
		}
		let diff1 = distance - this.tmpDistance[n];
		let diff2 = this.tmpDistance[n+1] - this.tmpDistance[n];
		return this.getPointAt(n + diff1 / diff2);
	}

	parsePoints() {
		if (!this.dirty) return this;
		this.dirty = false;
		this.polygon.points.length = 0;
		for (let i = 0; i < this.graphicsData.length; i++) {
			let shape = this.graphicsData[i].shape;
			if (shape && shape.points) {
				this.polygon.points = this.polygon.points.concat(shape.points);
			}
		}
		return this;
	}

	clear() {
		this.graphicsData.length = 0;
		this.currentPath = null;
		this.polygon.points.length = 0;
		this._closed = false;
		this.dirty = false;
		return this;
	}
}