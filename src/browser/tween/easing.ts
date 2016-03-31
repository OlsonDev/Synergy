'use strict';

export namespace Easing {
	export interface EasingFn {
		(n: number): number;
	}
}

const piOver2 = Math.PI / 2;
const twoPi = 2 * Math.PI;

export class Easing {
	static Linear = (n: number) => n;
	static InQuad = (n: number) => n * n;
	static OutQuad = (n: number) => n * (2 - n);
	static InOutQuad = (n: number) => {
		n *= 2;
		if (n < 1) return 0.5 * n * n;
		return -0.5 * (--n * (n - 2) - 1);
	};
	static InCubic = (n: number) => n * n * n;
	static OutCubic = (n: number) => --n * n * n + 1;
	static InOutCubic = (n: number) => {
		n *= 2;
		if (n < 1) return 0.5 * n * n * n;
		n -= 2
		return 0.5 * (n * n * n + 2);
	};
	static InQuart = (n: number) => n * n * n * n;
	static OutQuart = (n: number) => 1 - (--n * n * n * n);
	static InOutQuart = (n: number) => {
		n *= 2;
		if (n < 1) return 0.5 * n * n * n * n;
		n -= 2;
		return - 0.5 * (n * n * n * n - 2);
	};
	static InQuint = (n: number) => n * n * n * n * n;
	static OutQuint = (n: number) => --n * n * n * n * n + 1;
	static InOutQuint = (n: number) => {
		n *= 2;
		if (n < 1) return 0.5 * n * n * n * n * n;
		n -= 2;
		return 0.5 * (2 + n * n * n * n * n);
	};
	static InSine = (n: number) => 1 - Math.cos(n * piOver2);
	static OutSine = (n: number) => Math.sin(n * piOver2);
	static InOutSine = (n: number) => 0.5 * (1 - Math.cos(Math.PI * n));
	static InExpo = (n: number) => n === 0 ? 0 : Math.pow(1024, n - 1);
	static OutExpo = (n: number) => n === 1 ? 1 : 1 - Math.pow(2, -10 * n);
	static InOutExpo = (n: number) => {
		if (n === 0 || n === 1) return n;
		n *= 2;
		return n < 1
			? 0.5 * Math.pow(1024, n - 1)
			: 0.5 * (2 - Math.pow(2, -10 * (n - 1)))
		;
	};
	static InCirc = (n: number) => 1 - Math.sqrt(1 - n * n);
	static OutCirc = (n: number) => Math.sqrt(1 - (--n * n));
	static InOutCirc = (n: number) => {
		n *= 2
		return n < 1
			? -0.5 * (Math.sqrt(1 - n * n) - 1)
			: 0.5 * (Math.sqrt(1 - (n - 2) * (n - 2)) + 1)
		;
	};
	static InElastic = (n: number) => {
		if (n === 0 || n === 1) return n;
		const p = 0.4, a = 1, s = 0.1;
		let nMinusOne = n - 1;
		return -(a * Math.pow(2, 10 * nMinusOne) * Math.sin((nMinusOne - s) * twoPi / p));
	};
	static OutElastic = (n: number) => {
		if (n === 0 || n === 1) return n;
		const p = 0.4, a = 1, s = 0.1;
		return (a * Math.pow(2, -10 * n) * Math.sin((n - s) * twoPi / p) + 1);
	};
	static InOutElastic = (n: number) => {
		if (n === 0 || n === 1) return n;
		const p = 0.4, a = 1, s = 0.1;
		n *= 2;
		const nMinusOne = n - 1;
		return n < 1
			? -0.5 * (a * Math.pow(2, 10 * nMinusOne) * Math.sin((nMinusOne - s) * twoPi / p))
			: a * Math.pow(2, -10 * nMinusOne) * Math.sin((nMinusOne - s) * twoPi / p) * 0.5 + 1
		;
	};
	static InBack = (v: number) => {
		const s = v || 1.70158;
		const sPlusOne = s + 1;
		return (n: number) => n * n * (sPlusOne * n - s);
	};
	static OutBack = (v: number) => {
		const s = v || 1.70158;
		const sPlusOne = s + 1;
		return (n: number) => --n * n * (sPlusOne * n + s) + 1;
	};
	static InOutBack = (v: number) => {
		let s =  (v || 1.70158) * 1.525;
		let sPlusOne = s + 1;
		return (n: number) => {
			n *= 2;
			if (n < 1) {
				return 0.5 * (n * n * (sPlusOne * n - s));
			} else {
				const nMinusTwo = n - 2;
				return 0.5 * (nMinusTwo * nMinusTwo * (sPlusOne * nMinusTwo + s) + 2);
			}
		};
	};
	static InBounce = (n: number) => 1 - Easing.OutBounce(1 - n);
	static OutBounce = (n: number) => {
		const scale = 7.5625, max = 2.75;
		if (n < 1 / max) {
			return scale * n * n;
		} else if (n < 2 / max) {
			n -= 1.5 / max;
			return scale * n * n + 0.75;
		} else if (n < 2.5 / max) {
			n -= 2.25 / max;
			return scale * n * n + 0.9375;
		}
		n -= 2.625 / max;
		return scale * n * n + 0.984375;
	};
	static InOutBounce = (n: number) => 0.5 * (n < 0.5 ? Easing.InBounce(n * 2) : 1 + Easing.OutBounce(n * 2 - 1));
}