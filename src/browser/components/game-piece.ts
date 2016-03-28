'use strict';

import { Board } from './board';
import { getRandomEnum } from '../util/EnumHelper';

export enum GamePieceType {
	Red,
	Yellow,
	Green,
	Blue,
	Purple,
	Brown,
	// Skull
}

export class GamePiece extends PIXI.Sprite {
	type: GamePieceType;
	boardPosition: PIXI.Point;

	constructor(boardPosition: PIXI.Point) {
		const type = GamePiece.GetRandomType();
		super(PIXI.Texture.fromImage(`/images/game-piece-${GamePieceType[type].toLowerCase()}.svg`));
		this.type = type;
		this.boardPosition = boardPosition;
		this.width = this.height = 110;
		this.position.x = boardPosition.x * this.width;
		this.position.y = boardPosition.y * this.height;
		this.interactive = true;
		this.on('click', (e: any) => {
			const parent = this.parent as Board;
			if (!parent.firstGamePiece) {
				parent.firstGamePiece = this;
				return;
			}

			parent.swap(this, parent.firstGamePiece);
			parent.firstGamePiece = null;
		});

	}

	static GetRandomType() : GamePieceType {
		return getRandomEnum<GamePieceType>(GamePieceType);
	}
}