'use strict';

export class BoardTile extends PIXI.Sprite {
	constructor(x: number, y: number) {
		super(PIXI.Texture.fromImage(`/images/board-tile-${(x + y) % 2}.png`));
		this.width = this.height = 110;
		this.position.x = x * this.width;
		this.position.y = y * this.height;
	}
}