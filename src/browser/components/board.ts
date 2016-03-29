'use strict';
import { BoardTile } from './board-tile';
import { IGamePiece, GamePiece, GamePieceType } from './game-piece';
import { MatchData, MoveDirection } from './match-data';
import { getRandomIntExclusive } from '../util/math-helper';

export class Board extends PIXI.Container {
	tiles: BoardTile[][];
	gamePieces: IGamePiece[][];
	selectedGamePiece: IGamePiece;

	static numTiles = 8;

	constructor() {
		super();
		this.position.x = (1920 - (110 * Board.numTiles)) / 2;
		this.position.y = (1080 - (110 * Board.numTiles)) / 2;

		this.createTiles();
		this.createGamePieces();
		this.ensureAtLeastOneMove();
	}

	swap(a: IGamePiece, b: IGamePiece, force = false) {
		if (!force && !a.isAdjacentTo(b)) return false;

		[a.boardPosition, b.boardPosition] = [b.boardPosition, a.boardPosition];
		[a.position, b.position] = [b.position, a.position];
		this.gamePieces[a.boardPosition.y][a.boardPosition.x] = a;
		this.gamePieces[b.boardPosition.y][b.boardPosition.x] = b;
		return true;
	}

	private canSwapWithoutMatchBeingMade(a: IGamePiece, b: IGamePiece) {
		return !this.willMakeMatchAt(a.type, b.boardPosition) && !this.willMakeMatchAt(b.type, a.boardPosition);
	}

	private willMakeMatchAt(type: GamePieceType, boardPosition: PIXI.Point) {
		const dest = this.gamePieces[boardPosition.y][boardPosition.x];
		for (let matches of MatchData.Match3) {
			let allSameType = true;
			for (let similarGamePiece of matches) {
				const relativePiece = dest.relativePiece(similarGamePiece);
				if (type != relativePiece.type) {
					allSameType = false;
					break;
				}
			}
			if (allSameType) return true;
		}
		return false;
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
		let aboveAboveRow: IGamePiece[];
		let aboveRow: IGamePiece[];
		for (let y = 0; y < Board.numTiles; y++) {
			const row = [] as GamePiece[];
			this.gamePieces.push(row);
			let leftLeftPiece: IGamePiece;
			let leftPiece: IGamePiece;
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

	private moveExists() {
		let value = false;
		for (let row of this.gamePieces) {
			for (let gamePiece of row) {
				const type = gamePiece.type;
				for (let pm of MatchData.PotentialMatch3) {
					let allSameType = true;
					for (let sgp of pm.SimilarGamePieces) {
						const relativePiece = gamePiece.relativePiece(sgp);
						if (type != relativePiece.type) {
							allSameType = false;
							break;
						}
					}
					if (allSameType) return true;
				}
			}
		}
		return value;
	}

	private getRandomBoardPosition() {
		const x = getRandomIntExclusive(0, Board.numTiles);
		const y = getRandomIntExclusive(0, Board.numTiles);
		return new PIXI.Point(x, y);
	}

	private getRandomGamePiece() {
		const pt = this.getRandomBoardPosition();
		return this.gamePieces[pt.y][pt.x];
	}

	private ensureAtLeastOneMove() {
		while (!this.moveExists()) {
			let wasSwapped = false;
			const src = this.getRandomGamePiece();
			console.log(`Move does not exist!! Selecting piece at {${src.boardPosition.x}, ${src.boardPosition.y}}.`);
			// Since no moves exist, try to set up a move on the bottom; this will
			// increase the chances of a cascade and thus the player won't have to
			// endure watching a rearrange animation shortly into the game.
			for (let y = Board.numTiles - 1; y > 0; y--) {
				for (let x = 0; x < Board.numTiles; x++) {
					const dest = this.gamePieces[y][x];
					if (src.type !== dest.type) continue;
					for (let adjacent of dest.adjacents) {
						if (!adjacent.isOnBoard) continue;
						if (!this.canSwapWithoutMatchBeingMade(src, adjacent)) continue;
						console.log(`Swapping piece at {${src.boardPosition.x}, ${src.boardPosition.y}} with piece at {${adjacent.boardPosition.x}, ${adjacent.boardPosition.y}}.`);
						this.swap(src, adjacent, true);
						wasSwapped = true;
						break;
					}
					if (wasSwapped) break;
				}
				if (wasSwapped) break;
			}
		}
	}
}