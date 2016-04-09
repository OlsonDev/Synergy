'use strict';

import { TweenManager } from '../tween/tween-manager';
import { GamePiece } from './game-piece';

export class Highlighter extends PIXI.Container {
	constructor() {
		super();
		const layer0 = PIXI.Sprite.fromImage(`/images/highlighter-0.svg`);
		const layer1 = PIXI.Sprite.fromImage(`/images/highlighter-1.svg`);
		this.addChild(layer0);
		this.addChild(layer1);
		this.width = this.height = layer0.width = layer0.height = layer1.width = layer1.height = GamePiece.Size;
		layer0.anchor.x = layer0.anchor.y = layer1.anchor.x = layer1.anchor.y = 0.5;
		this.alpha = 0;
		TweenManager.Instance.createTween(this)
			.time(500000)
			.to({ rotation: 360 })
			.loop(true)
			.start()
		;
		TweenManager.Instance.createTween(layer1)
			.time(1000)
			.to({ alpha: 0 })
			.pingPong(true)
			.loop(true)
			.start()
		;
	}
}