'use strict';
import { BoardTile } from './board-tile';
import { GamePiece } from './game-piece';

export class Board extends PIXI.Container {
	tiles: BoardTile[][];
	gamePieces: GamePiece[][];
	firstGamePiece: GamePiece;

	static numTiles = 8;

	constructor() {
		super();
		this.position.x = (1920 - (110 * Board.numTiles)) / 2;
		this.position.y = (1080 - (110 * Board.numTiles)) / 2;

		this.createTiles();
		this.createGamePieces();
	}

	swap(a: GamePiece, b: GamePiece) {
		const aBoardPosition = a.boardPosition;
		const bBoardPosition = b.boardPosition;

		a.boardPosition = bBoardPosition;
		b.boardPosition = aBoardPosition;

		const aPosition = a.position;
		const bPosition = b.position;

		a.position = bPosition;
		b.position = aPosition;

		this.gamePieces[aBoardPosition.y][aBoardPosition.x] = b;
		this.gamePieces[bBoardPosition.y][bBoardPosition.x] = a;
	}

	private createTiles() {
		this.tiles = [];
		for (var x = 0; x < Board.numTiles; x++) {
			const row = [] as BoardTile[];
			this.tiles.push(row);
			for (var y = 0; y < Board.numTiles; y++) {
				const tile = new BoardTile(x, y);
				row.push(tile);
				this.addChild(tile);
			}
		}
	}

	private createGamePieces() {
		this.gamePieces = [];
		for (var x = 0; x < Board.numTiles; x++) {
			const row = [] as GamePiece[];
			this.gamePieces.push(row);
			for (var y = 0; y < Board.numTiles; y++) {
				const boardPosition = new PIXI.Point(x, y);
				const gamePiece = new GamePiece(boardPosition);
				row.push(gamePiece);
				this.addChild(gamePiece);
			}
		}
	}
}