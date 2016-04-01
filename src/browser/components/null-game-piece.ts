'use strict';

import { IGamePiece, GamePieceType } from './game-piece';

const nanPoint = new PIXI.Point(NaN, NaN);

export class NullGamePiece extends PIXI.Sprite implements IGamePiece {
	static get Instance() {
		return new NullGamePiece;
	}

	constructor() {
		super(PIXI.Texture.EMPTY);
	}

	get type() { return GamePieceType.None; }
	get boardPosition() { return nanPoint; }
	get isOnBoard() { return false; }
	get left() { return this; }
	get right() { return this; }
	get above() { return this; }
	get below() { return this; }
	relativePiece(deltaPosition: PIXI.Point) { return this; }
	get adjacents() { return <IGamePiece[]>[]; }
	isAdjacentTo(other: IGamePiece) { return false; }
	get removeAfterCascade() { return false; }
}