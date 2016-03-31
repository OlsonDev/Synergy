'use strict';

import { Tween } from './tween';
import { Easing } from './easing';

export class TweenManager {
	last = 0;
	tweens: Tween[] = [];
	tweensToDelete: Tween[] = [];

	static Instance = new TweenManager();

	update(delta?: number) {
		let deltaMS: number;
		if (!delta && delta !== 0) {
			deltaMS = this.getDeltaMS();
			delta = deltaMS / 1000;
		} else {
			deltaMS = delta * 1000;
		}

		for (let i = 0; i < this.tweens.length; i++) {
			let tween = this.tweens[i];
			if (tween.active) {
				tween.update(delta, deltaMS);
				if (tween.shouldBeRemoved) {
					tween.remove();
				}
			}
		}

		if (this.tweensToDelete.length) {
			for (let i = 0; i < this.tweensToDelete.length; i++) {
				this.remove(this.tweensToDelete[i]);
			}

			this.tweensToDelete.length = 0;
		}
	}

	getTweensForTarget(target: any) {
		let tweens: Tween[] = [];
		for (let tween of this.tweens) {
			if (tween.target !== target) continue;
			tweens.push(tween);
		}
		return tweens;
	}

	createTween(target: any) {
		return new Tween(target, this);
	}

	addTween(tween: Tween) {
		tween.manager = this;
		this.tweens.push(tween);
	}

	removeTween(tween: Tween) {
		this.tweensToDelete.push(tween);
	}

	private remove(tween: Tween) {
		const index = this.tweens.indexOf(tween);
		if (index === -1) return;
		this.tweens.splice(index, 1);
	}

	private getDeltaMS() {
		if (this.last === 0) {
			this.last = performance.now();
		}
		const now = performance.now();
		const deltaMS = now - this.last;
		this.last = now;
		return deltaMS;
	}
}