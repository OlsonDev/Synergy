'use strict';

import { getRandomEnum } from '../util/EnumHelper';

export enum GamePieceType {
	Red,
	Yellow,
	Green,
	Blue,
	Purple,
	Brown,
	Skull
}

export class GamePiece extends PIXI.Sprite {
	type: GamePieceType;

	constructor(x: number, y: number) {
		const type = GamePiece.GetRandomType();
		super(PIXI.Texture.fromImage(`/images/game-piece-${GamePieceType[type].toLowerCase()}.svg`));
		this.type = type;
		this.width = this.height = 110;
		this.position.x = x * this.width;
		this.position.y = y * this.height;
	}

	static GetRandomType() : GamePieceType {
		return getRandomEnum<GamePieceType>(GamePieceType);
	}
}