'use strict';
import { BoardTile } from './board-tile';
import { GamePiece, GamePieceType } from './game-piece';

export class Board extends PIXI.Container {
	tiles: BoardTile[][];
	gamePieces: GamePiece[][];
	selectedGamePiece: GamePiece;

	static numTiles = 8;

	constructor() {
		super();
		this.position.x = (1920 - (110 * Board.numTiles)) / 2;
		this.position.y = (1080 - (110 * Board.numTiles)) / 2;

		this.createTiles();
		this.createGamePieces();
		this.ensureAtLeastOneMove();
	}

	swap(a: GamePiece, b: GamePiece) {
		if (!a.isAdjacentTo(b)) return false;

		[a.boardPosition, b.boardPosition] = [b.boardPosition, a.boardPosition];
		[a.position, b.position] = [b.position, a.position];
		this.gamePieces[a.boardPosition.y][a.boardPosition.x] = a;
		this.gamePieces[b.boardPosition.y][b.boardPosition.x] = b;
		return true;
	}

	private createTiles() {
		this.tiles = [];
		for (let y = 0; y < Board.numTiles; y++) {
			const row = [] as BoardTile[];
			this.tiles.push(row);
			for (let x = 0; x < Board.numTiles; x++) {
				const tile = new BoardTile(x, y);
				row.push(tile);
				this.addChild(tile);
			}
		}
	}

	private createGamePieces() {
		this.gamePieces = [];
		let aboveAboveRow: GamePiece[];
		let aboveRow: GamePiece[];
		for (let y = 0; y < Board.numTiles; y++) {
			const row = [] as GamePiece[];
			this.gamePieces.push(row);
			let leftLeftPiece: GamePiece;
			let leftPiece: GamePiece;
			for (let x = 0; x < Board.numTiles; x++) {
				const boardPosition = new PIXI.Point(x, y);
				const disallowedTypes = [ GamePieceType.None ];

				const abovePiece = aboveRow ? aboveRow[x] : null;
				const aboveAbovePiece = aboveAboveRow ? aboveAboveRow[x] : null;

				if (abovePiece && aboveAbovePiece && abovePiece.type == aboveAbovePiece.type) {
					disallowedTypes.push(aboveAbovePiece.type);
				}

				if (leftPiece && leftLeftPiece && leftPiece.type == leftLeftPiece.type) {
					disallowedTypes.push(leftPiece.type);
				}

				const type = GamePiece.GetRandomType(disallowedTypes);
				const gamePiece = new GamePiece(boardPosition, type);
				row.push(gamePiece);
				this.addChild(gamePiece);

				leftLeftPiece = leftPiece;
				leftPiece = gamePiece;
			}

			aboveAboveRow = aboveRow;
			aboveRow = row;
		}
	}

	private ensureAtLeastOneMove() {
		console.log('TODO: ensureAtLeastOneMove');
	}
}