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
		this.position.x = boardPosition.x * this.width + 55;
		this.position.y = boardPosition.y * this.height + 55;
		this.anchor = new PIXI.Point(0.5, 0.5);

		this.interactive = true;
		this.on('click', (e: any) => {
			if (!this.board.selectedGamePiece) {
				this.board.selectedGamePiece = this;
				return;
			}
			const swapped = this.board.swap(this, this.board.selectedGamePiece);
			this.board.selectedGamePiece = null;
		});
	}

	get board(): Board {
		return this.parent as Board;
	}

	get left(): GamePiece {
		const x = this.boardPosition.x - 1;
		if (x < 0) return null;
		const y = this.boardPosition.y;
		return this.board.gamePieces[y][x];
	}

	get right(): GamePiece {
		const x = this.boardPosition.x + 1;
		if (x >= Board.numTiles) return null;
		const y = this.boardPosition.y;
		return this.board.gamePieces[y][x];
	}

	get above(): GamePiece {
		const y = this.boardPosition.y - 1;
		if (y < 0) return null;
		const x = this.boardPosition.x;
		return this.board.gamePieces[y][x];
	}

	get below(): GamePiece {
		const y = this.boardPosition.y + 1;
		if (y >= Board.numTiles) return null;
		const x = this.boardPosition.x;
		return this.board.gamePieces[y][x];
	}

	get adjacents(): GamePiece[] {
		const adjacents: GamePiece[] = [];
		const left = this.left;
		const right = this.right;
		const above = this.above;
		const below = this.below;
		if (left) adjacents.push(left);
		if (right) adjacents.push(right);
		if (above) adjacents.push(above);
		if (below) adjacents.push(below);
		return adjacents;
	}

	isAdjacentTo(other: GamePiece) {
		const adjacents = this.adjacents;
		const index = adjacents.indexOf(other);
		return index !==  -1;
	}

	static GetRandomType() : GamePieceType {
		return getRandomEnum<GamePieceType>(GamePieceType);
	}
}