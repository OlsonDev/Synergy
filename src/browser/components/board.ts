'use strict';
import { BoardTile } from './board-tile';
import { IGamePiece, GamePiece, GamePieceType } from './game-piece';
import { MatchData, MoveDirection } from './match-data';
import { TweenManager } from '../tween/tween-manager';
import { Easing } from '../tween/easing';
import { getRandomIntExclusive } from '../util/math-helper';

export class Board extends PIXI.Container {
	static GridSize = 8;

	tiles: BoardTile[][];
	gamePieces: IGamePiece[][];
	numMovingGamePieces = 0;
	selectedGamePiece: IGamePiece;

	constructor() {
		super();
		this.position.x = (1920 - (110 * Board.GridSize)) / 2;
		this.position.y = (1080 - (110 * Board.GridSize)) / 2;

		this.createTiles();
		this.createGamePieces();
		this.ensureAtLeastOneMove();
	}

	get playerCanMakeMove() {
		return this.numMovingGamePieces === 0;
	}

	private canSwap(a: IGamePiece, b: IGamePiece, force = false) {
		if (force) return true;
		if (!a.isAdjacentTo(b)) return false;
		if (a.type === b.type) return false;
		if (this.willMakeMatchWhenSwappedWith(a, b)) return true;
		return this.willMakeMatchWhenSwappedWith(b, a);
	}

	swap(a: IGamePiece, b: IGamePiece, force = false) {
		if (!this.canSwap(a, b, force)) return false;

		// Immediately update board data
		[a.boardPosition, b.boardPosition] = [b.boardPosition, a.boardPosition];
		this.gamePieces[a.boardPosition.y][a.boardPosition.x] = a;
		this.gamePieces[b.boardPosition.y][b.boardPosition.x] = b;

		if (force) {
			[a.position, b.position] = [b.position, a.position];
		} else {
			this.numMovingGamePieces += 2;

			TweenManager.Instance.createTween(a)
				.time(300)
				.easing(Easing.OutCubic)
				.to(b.position.clone())
				.start()
				.on('end', () => this.swapDone());
			;

			TweenManager.Instance.createTween(b)
				.time(300)
				.easing(Easing.OutCubic)
				.to(a.position.clone())
				.start()
				.on('end', () => this.swapDone());
			;
		}

		return true;
	}

	private swapDone() {
		this.numMovingGamePieces--;
		if (this.numMovingGamePieces) return;
		this.findAndRemoveMatches();
	}

	private findMatches() {
		// TODO: Should return an object specifying match amount (3/4/5-of-akind), type, game pieces involved)
		const matches: Set<IGamePiece> = new Set();
		for (let y = 0; y < Board.GridSize; y++) {
			const row = this.gamePieces[y];
			for (let x = 0; x < Board.GridSize; x++) {
				const gamePiece = row[x];
				const type = gamePiece.type;
				// TODO: Should loop Match4, dedupe with Match3
				for (let matchTemplates of MatchData.Match3) {
					let allSameType = true;
					for (let similarGamePiece of matchTemplates) {
						let relativePiece = gamePiece.relativePiece(similarGamePiece);
						if (type != relativePiece.type) {
							allSameType = false;
							break;
						}
					}
					if (allSameType) {
						matches.add(gamePiece);
					}
				}
			}
		}
		return matches;
	}

	private findAndRemoveMatches() {
		const gamePieces = this.findMatches();
		this.numMovingGamePieces += gamePieces.size;
		for (let gamePiece of gamePieces) {
			TweenManager.Instance.createTween(gamePiece)
				.time(300)
				.easing(Easing.OutCubic)
				.to({ alpha: 0, scale: { x: 1.5, y: 1.5 } })
				.start()
				.on('end', () => this.numMovingGamePieces--)
			;
		}
	}

	private canSwapWithoutMatchBeingMade(a: IGamePiece, b: IGamePiece) {
		return !this.willMakeMatchWhenSwappedWith(a, b) && !this.willMakeMatchWhenSwappedWith(b, a);
	}

	private willMakeMatchWhenSwappedWith(src: IGamePiece, dest: IGamePiece) {
		const type = src.type;
		const boardPosition = dest.boardPosition;

		for (let matchTemplates of MatchData.Match3) {
			let allSameType = true;
			for (let similarGamePiece of matchTemplates) {
				let relativePiece = dest.relativePiece(similarGamePiece);
				if (relativePiece === src) {
					// pretend the swap happened
					relativePiece = dest;
				}
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
		for (let y = 0; y < Board.GridSize; y++) {
			const row = [] as BoardTile[];
			this.tiles.push(row);
			for (let x = 0; x < Board.GridSize; x++) {
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
		for (let y = 0; y < Board.GridSize; y++) {
			const row = [] as GamePiece[];
			this.gamePieces.push(row);
			let leftLeftPiece: IGamePiece;
			let leftPiece: IGamePiece;
			for (let x = 0; x < Board.GridSize; x++) {
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

	private gamePieceIsInPotentialMatch(gamePiece: IGamePiece) {
		const type = gamePiece.type;
		for (let pm of MatchData.PotentialMatch3All) {
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
		return false;
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
		const x = getRandomIntExclusive(0, Board.GridSize);
		const y = getRandomIntExclusive(0, Board.GridSize);
		return new PIXI.Point(x, y);
	}

	private getRandomGamePiece() {
		const pt = this.getRandomBoardPosition();
		return this.gamePieces[pt.y][pt.x];
	}

	private ensureAtLeastOneMove() {
		if (this.moveExists()) return;
		while (true) {
			let wasSwapped = false;
			const src = this.getRandomGamePiece();
			// Since no moves exist, try to set up a move on the bottom; this will
			// increase the chances of a cascade and thus the player won't have to
			// endure watching a rearrange animation shortly into the game.
			for (let y = Board.GridSize - 1; y > 0; y--) {
				for (let x = 0; x < Board.GridSize; x++) {
					const dest = this.gamePieces[y][x];
					if (src.type !== dest.type) continue;
					for (let adjacent of dest.adjacents) {
						if (!adjacent.isOnBoard) continue;
						if (!this.canSwapWithoutMatchBeingMade(src, adjacent)) continue;
						this.swap(src, adjacent, true);
						if (this.gamePieceIsInPotentialMatch(adjacent)) return;
						if (this.gamePieceIsInPotentialMatch(src)) return;
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