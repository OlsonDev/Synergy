'use strict';

import { NullGamePiece } from './null-game-piece';
import { Board } from './board';
import { getRandomEnum } from '../util/enum-helper';

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
	boardPosition: PIXI.Point;
	left: IGamePiece;
	right: IGamePiece;
	above: IGamePiece;
	below: IGamePiece;
	relativePiece(deltaPosition: PIXI.Point) : IGamePiece;
	adjacents: IGamePiece[];
	adjacentsOnBoard: IGamePiece[];
	isAdjacentTo(other: IGamePiece): boolean;
	isOnBoard: boolean;
	removeAfterCascade: boolean;
}

export class GamePiece extends PIXI.Sprite {
	removeAfterCascade = false;

	static Size = 120;
	static HalfGamePieceSize = GamePiece.Size / 2;

	static BoardPositionToPosition(boardPosition: PIXI.Point, position?: PIXI.Point) {
		position = position ? position : new PIXI.Point();
		position.x = GamePiece.HalfGamePieceSize + boardPosition.x * GamePiece.Size;
		position.y = GamePiece.HalfGamePieceSize + boardPosition.y * GamePiece.Size;
		return position;
	}

	constructor(public boardPosition: PIXI.Point, public type: GamePieceType) {
		super(GamePiece.GetTexture(type));
		this.width = this.height = GamePiece.Size;
		GamePiece.BoardPositionToPosition(boardPosition, this.position);
		this.anchor.x = 0.5;
		this.anchor.y = 0.5;

		this.interactive = true;
		this.on('click', (e: any) => {
			this.board.endDrag(this);
			this.board.logGamePieces(this);
			if (!this.board.playerCanMakeMove) return;
			if (!this.board.selectedGamePiece) {
				this.board.selectedGamePiece = this;
				this.board.highlighter.x = this.x;
				this.board.highlighter.y = this.y;
				this.board.highlighter.alpha = 1;
				return;
			}
			const swapped = this.board.swap(this, this.board.selectedGamePiece);
			this.board.selectedGamePiece = null;
			this.board.highlighter.alpha = 0;
		});

		this.on('mousedown', (e: any) => {
			if (!this.board.playerCanMakeMove) return;
			this.board.beginDrag(this);
		});
	}

	get board(): Board {
		return this.parent as Board;
	}

	get isOnBoard() { return true; }

	get left(): IGamePiece {
		const x = this.boardPosition.x - 1;
		if (x < 0) return NullGamePiece.Instance;
		const y = this.boardPosition.y;
		return this.board.gamePieces[y][x];
	}

	get right(): IGamePiece {
		const x = this.boardPosition.x + 1;
		if (x >= Board.GridSize) return NullGamePiece.Instance;
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
		if (y >= Board.GridSize) return NullGamePiece.Instance;
		const x = this.boardPosition.x;
		return this.board.gamePieces[y][x];
	}

	relativePiece(deltaPosition: PIXI.Point) : IGamePiece {
		const x = this.boardPosition.x + deltaPosition.x;
		if (x < 0 || x >= Board.GridSize) return NullGamePiece.Instance;
		const y = this.boardPosition.y + deltaPosition.y;
		if (y < 0 || y >= Board.GridSize) return NullGamePiece.Instance;
		return this.board.gamePieces[y][x];
	}

	get adjacents(): IGamePiece[] {
		return [ this.left, this.right, this.above, this.below ];
	}

	get adjacentsOnBoard(): IGamePiece[] {
		const adjacents: IGamePiece[] = [];
		const left = this.left
			, right = this.right
			, above = this.above
			, below = this.below
		;
		if (left.isOnBoard) adjacents.push(left);
		if (right.isOnBoard) adjacents.push(right);
		if (above.isOnBoard) adjacents.push(above);
		if (below.isOnBoard) adjacents.push(below);
		return adjacents;
	}

	isAdjacentTo(other: IGamePiece): boolean {
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