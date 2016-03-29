'use strict';

import { IGamePiece, GamePieceType } from './game-piece';

export class NullGamePiece extends PIXI.Sprite implements IGamePiece {
	static get Instance() {
		return new NullGamePiece;
	}

	constructor() {
		super(PIXI.Texture.EMPTY);
	}

	get type() { return GamePieceType.None; }
	get left() { return this; }
	get right() { return this; }
	get above() { return this; }
	get below() { return this; }
	get adjacents() { return <IGamePiece[]>[]; }
	isAdjacentTo(other: IGamePiece) { return false; }
}