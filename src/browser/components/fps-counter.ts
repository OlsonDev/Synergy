'use strict';

export class FpsCounter extends PIXI.Text {
	constructor() {
		super('', {
			fill: '#0f0'
			, stroke: '#000'
			, strokeThickness: 4
			, font: 'bold 20px Arial'
		});
		this.anchor.x = 1;
		this.anchor.y = 1;
		this.position.x = window.innerWidth;
		this.position.y = window.innerHeight;

		PIXI.ticker.shared.add((time) => {
			this.text = Math.round(PIXI.ticker.shared.FPS).toString();
		});
	}
}