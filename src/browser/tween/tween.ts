'use strict';

import * as PIXI from 'pixi.js';
import { TweenManager } from './tween-manager';
import { Easing } from './easing';
import { TweenPath } from './tween-path';

function isObject(obj: any) {
	return Object.prototype.toString.call(obj) === "[object Object]";
}

function clone(obj: any) {
	return JSON.parse(JSON.stringify(obj));
}

function recursivelyApplyTween(to: any, from: any, target: any, time: number, elapsed: number, easing: Easing.EasingFn) {
	for (let k in to) {
		if (isObject(to[k])) {
			recursivelyApplyTween(to[k], from[k], target[k], time, elapsed, easing);
		} else {
			let b = from[k];
			let c = to[k] - from[k];
			let d = time;
			let t = elapsed / d;
			target[k] = b + c * easing(t);
		}
	}
}

function parseRecursiveData(to: any, from: any, target: any) {
	for (let k in to) {
		if (from[k] !== 0 && !from[k]) {
			if (isObject(target[k])) {
				from[k] = clone(target[k]);
				parseRecursiveData(to[k], from[k], target[k]);
			} else {
				from[k] = target[k];
			}
		}
	}
}

export class Tween extends PIXI.utils.EventEmitter {
	repeat = 0;
	loop = false;
	delay = 0;
	pingPong = false;

	private _active = false;
	private _isStarted = false;
	private _isEnded = false;
	private _time = 0;
	private _easing = Easing.Linear;
	private _to: any = null;
	private _from: any = null;
	private _delayTime = 0;
	private _elapsedTime = 0;
	private _repeat = 0;
	private _pingPong = false;
	private _removeWhenEnded = true;
	private _chainTween: Tween;

	path: TweenPath = null;
	pathReverse = false;
	pathFrom = 0;
	pathTo = 0;

	constructor(public target: PIXI.DisplayObject, public manager?: TweenManager) {
		super();
		if (!manager) return;
		manager.addTween(this);
	}

	get active() { return this._active; }
	get isStarted() { return this._isStarted; }
	get isEnded() { return this._isEnded; }
	get shouldBeRemoved() { return this._isEnded && this._removeWhenEnded; }

	addTo(manager: TweenManager) {
		this.manager = manager;
		this.manager.addTween(this);
		return this;
	}

	chain(tween?: Tween) {
		if (!tween) tween = new Tween(this.target);
		this._chainTween = tween;
		return tween;
	}

	start() {
		this._active = true;
		return this;
	}

	stop() {
		this._active = false;
		this.emit('stop');
		return this;
	}

	time(duration: number) {
		this._time = duration;
		return this;
	}

	easing(easing: Easing.EasingFn) {
		this._easing = easing;
		return this;
	}

	to(data: any) {
		this._to = data;
		return this;
	}

	from(data: any) {
		this._from = data;
		return this;
	}

	removeWhenEnded(value: boolean) {
		this._removeWhenEnded = value;
		return this;
	}

	remove() {
		if (!this.manager) return this;
		this.manager.removeTween(this);
		return this;
	}

	clear() {
		this._time = 0;
		this._active = false;
		this._easing = Easing.Linear;
		this._removeWhenEnded = false;
		this.repeat = 0;
		this.loop = false;
		this.delay = 0;
		this.pingPong = false;
		this._isStarted = false;
		this._isEnded = false;
		this._to = null;
		this._from = null;
		this._delayTime = 0;
		this._elapsedTime = 0;
		this._repeat = 0;
		this._pingPong = false;
		this._chainTween = null;
		this.path = null;
		this.pathReverse = false;
		this.pathFrom = 0;
		this.pathTo = 0;
	}

	reset() {
		this._elapsedTime = 0;
		this._repeat = 0;
		this._delayTime = 0;
		this._isStarted = false;
		this._isEnded = false;
		if (this.pingPong && this._pingPong) {
			let _to = this._to;
			let _from = this._from;
			this._to = _from;
			this._from = _to;
			this._pingPong = false;
		}
		return this;
	}

	update(delta: number, deltaMS: number) {
		if (!this.canUpdate && (this._to || this.path)) return;
		let _to: any, _from: any;
		if (this.delay > this._delayTime) {
			this._delayTime += deltaMS;
			return;
		}

		if (!this._isStarted) {
			this.reallyStart();
		}

		let time = this.pingPong ? this._time / 2 : this._time;
		if (time > this._elapsedTime) {
			let t = this._elapsedTime+deltaMS;
			let ended = (t>=time);

			this._elapsedTime = ended ? time : t;
			this.apply(time);

			let realElapsed = this._pingPong ? time + this._elapsedTime : this._elapsedTime;
			this.emit('update', realElapsed);

			if (ended) {
				if (this.pingPong && !this._pingPong) {
					this._pingPong = true;
					_to = this._to;
					_from = this._from;
					this._from = _to;
					this._to = _from;

					if (this.path) {
						_to = this.pathTo;
						_from = this.pathFrom;
						this.pathTo = _from;
						this.pathFrom = _to;
					}

					this.emit('pingpong');
					this._elapsedTime = 0;
					return;
				}

				if (this.loop || this.repeat > this._repeat) {
					this._repeat++;
					this.emit('repeat', this._repeat);
					this._elapsedTime = 0;

					if (this.pingPong && this._pingPong) {
						_to = this._to;
						_from = this._from;
						this._to = _from;
						this._from = _to;

						if (this.path) {
							_to = this.pathTo;
							_from = this.pathFrom;
							this.pathTo = _from;
							this.pathFrom = _to;
						}

						this._pingPong = false;
					}
					return;
				}

				this._isEnded = true;
				this._active = false;
				this.emit('end');

				if (this._chainTween) {
					this._chainTween.addTo(this.manager);
					this._chainTween.start();
				}
			}
			return;
		}
	}

	private reallyStart() {
		this.parseData();
		this._isStarted = true;
		this.emit('start');
	}

	private parseData() {
		if (this._isStarted) return;

		if (!this._from)this._from = {};
		parseRecursiveData(this._to, this._from, this.target);

		if (this.path) {
			let distance = this.path.totalDistance();
			if (this.pathReverse) {
				this.pathFrom = distance;
				this.pathTo = 0;
			} else {
				this.pathFrom = 0;
				this.pathTo = distance;
			}
		}
	}

	private apply(time: number) {
		recursivelyApplyTween(this._to, this._from, this.target, time, this._elapsedTime, this._easing);

		if (this.path) {
			let time = (this.pingPong) ? this._time/2 : this._time;
			let b = this.pathFrom;
			let c = this.pathTo - this.pathFrom;
			let d = time;
			let t = this._elapsedTime/d;

			let distance = b+(c*this._easing(t));
			let pos = this.path.getPointAtDistance(distance);
			this.target.position.set(pos.x, pos.y);
		}
	}

	private get canUpdate() {
		return this._time && this._active && this.target;
	}
}