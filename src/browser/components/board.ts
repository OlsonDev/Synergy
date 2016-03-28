'use strict';
import { BoardTile } from './board-tile';
import { GamePiece } from './game-piece';

export class Board extends PIXI.Container {
	tiles: BoardTile[][];
	gamePieces: GamePiece[][];

	static numTiles = 8;

	constructor() {
		super();
		this.position.x = 50;
		this.position.y = 50;

		this.createTiles();
		this.createGamePieces();
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
				const gamePiece = new GamePiece(x, y);
				row.push(gamePiece);
				this.addChild(gamePiece);
			}
		}
	}
}