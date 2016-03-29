'use strict';

import { NullGamePiece } from './null-game-piece';
import { Board } from './board';
import { getRandomEnum } from '../util/EnumHelper';

export enum GamePieceType {
	None,
	Red,
	Yellow,
	Green,
	Blue,
	Purple,
	Brown
}

export interface IGamePiece extends PIXI.Sprite {
	type: GamePieceType;
	left: IGamePiece;
	right: IGamePiece;
	above: IGamePiece;
	below: IGamePiece;
	adjacents: IGamePiece[];
	isAdjacentTo(other: IGamePiece): boolean;
}

export class GamePiece extends PIXI.Sprite {
	constructor(public boardPosition: PIXI.Point, public type: GamePieceType) {
		super(GamePiece.GetTexture(type));
		this.width = this.height = 110;
		this.position.x = boardPosition.x * this.width + 55;
		this.position.y = boardPosition.y * this.height + 55;
		this.anchor.x = 0.5;
		this.anchor.y = 0.5;

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

	get left(): IGamePiece {
		const x = this.boardPosition.x - 1;
		if (x < 0) return NullGamePiece.Instance;
		const y = this.boardPosition.y;
		return this.board.gamePieces[y][x];
	}

	get right(): IGamePiece {
		const x = this.boardPosition.x + 1;
		if (x >= Board.numTiles) return NullGamePiece.Instance;
		const y = this.boardPosition.y;
		return this.board.gamePieces[y][x];
	}

	get above(): IGamePiece {
		const y = this.boardPosition.y - 1;
		if (y < 0) return NullGamePiece.Instance;
		const x = this.boardPosition.x;
		return this.board.gamePieces[y][x];
	}

	get below(): IGamePiece {
		const y = this.boardPosition.y + 1;
		if (y >= Board.numTiles) return NullGamePiece.Instance;
		const x = this.boardPosition.x;
		return this.board.gamePieces[y][x];
	}

	relativePiece(deltaPosition: PIXI.Point) : IGamePiece {
		const x = this.boardPosition.x + deltaPosition.x;
		if (x < 0 || x >= Board.numTiles) return NullGamePiece.Instance;
		const y = this.boardPosition.y + deltaPosition.y;
		if (y < 0 || y >= Board.numTiles) return NullGamePiece.Instance;
		return this.board.gamePieces[y][x];
	}

	get adjacents(): IGamePiece[] {
		return [ this.left, this.right, this.above, this.below ];
	}

	isAdjacentTo(other: IGamePiece) {
		// Optimize for common case; NullGamePiece's adjacents = []
		// So check if we're in other's adjacents instead of bothering
		// to check if other == NullGamePiece.Instance
		return other.adjacents.includes(this);
	}

	static GetRandomType(disallowedTypes?: GamePieceType[]) : GamePieceType {
		return getRandomEnum<GamePieceType>(GamePieceType, disallowedTypes);
	}

	static GetTexture(type: GamePieceType) {
		return PIXI.Texture.fromImage(`/images/game-piece-${GamePieceType[type].toLowerCase()}.svg`);
	}
}