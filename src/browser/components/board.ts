'use strict';
import { BoardTile } from './board-tile';
import { Highlighter } from './highlighter';
import { IGamePiece, GamePiece, GamePieceType } from './game-piece';
import { Match } from '../models/match';
import { MatchData, MoveDirection } from '../models/match-data';
import { TweenManager } from '../tween/tween-manager';
import { Easing } from '../tween/easing';
import { getRandomIntExclusive } from '../util/math-helper';

export class Board extends PIXI.Container {
	static GridSize = 8;

	tiles: BoardTile[][] = [];
	gamePieces: IGamePiece[][] = [];
	gamePiecesToRemove = new Set<IGamePiece>();
	numMovingGamePieces = 0;
	selectedGamePiece: IGamePiece;
	highlighter: Highlighter;

	constructor() {
		super();
		this.position.x = (1920 - (110 * Board.GridSize)) / 2;
		this.position.y = (1080 - (110 * Board.GridSize)) / 2;

		this.createTiles();

		this.highlighter = new Highlighter();
		this.addChild(this.highlighter);

		this.createGamePieces();
		this.ensureAtLeastOneMove();
	}

	logGamePieces(highlightGamePiece?: IGamePiece) {
		let str = '', args: string[] = [];
		for (let row of this.gamePieces) {
			for (let gamePiece of row) {
				str += `%c${gamePiece.type}`;
				const highlightCss = highlightGamePiece === gamePiece
					? 'border: 1px solid #FFF; font-weight: bold;'
					: 'border: 1px solid #000;'
				;
				const otherCss = `display: block; padding: 5px 11px; line-height: 35px; font-size: 20px; color: #FFF; ${highlightCss}`;
				switch (gamePiece.type) {
					case GamePieceType.None:   args.push(`background: #616161; ${otherCss}`); break;
					case GamePieceType.Red:    args.push(`background: #D32F2F; ${otherCss}`); break;
					case GamePieceType.Yellow: args.push(`background: #FFA000; ${otherCss}`); break;
					case GamePieceType.Green:  args.push(`background: #388E3C; ${otherCss}`); break;
					case GamePieceType.Blue:   args.push(`background: #1976D2; ${otherCss}`); break;
					case GamePieceType.Purple: args.push(`background: #512DA8; ${otherCss}`); break;
					case GamePieceType.Brown:  args.push(`background: #5D4037; ${otherCss}`); break;
				}
			}
			str += '\n';
		}
		console.log(str, ...args);
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
			// Don't use [a.pos, b.pos] = [b.pos, a.pos]
			// cuz could have animations bound to actual object
			[a.x, a.y, b.x, b.y] = [b.x, b.y, a.x, b.y];
		} else {
			this.numMovingGamePieces += 2;

			TweenManager.Instance.createTween(a)
				.time(300)
				.easing(Easing.OutCubic)
				.to(b.position.clone())
				.start()
				.on('end', () => this.swapTweenDone());
			;

			TweenManager.Instance.createTween(b)
				.time(300)
				.easing(Easing.OutCubic)
				.to(a.position.clone())
				.start()
				.on('end', () => this.swapTweenDone());
			;
		}

		return true;
	}

	private swapTweenDone() {
		this.numMovingGamePieces--;
		if (this.numMovingGamePieces) return;
		this.findAndRemoveAllMatches();
	}

	private findAllMatches() {
		const matches: Match[] = [];
		for (let y = 0; y < Board.GridSize; y++) {
			const row = this.gamePieces[y];
			for (let x = 0; x < Board.GridSize; x++) {
				const gamePiece = row[x];
				let match4s = this.findGamePieceMatches(gamePiece, MatchData.Match4);
				let match3s = this.findGamePieceMatches(gamePiece, MatchData.Match3);
				matches.push(...match4s);
				matches.push(...match3s);
			}
		}
		return this.mergeAndDedupeMatches(matches);
	}

	private findGamePieceMatches(gamePiece: IGamePiece, matchData: PIXI.Point[][]) {
		const type = gamePiece.type;
		const matches: Match[] = [];
		for (let matchTemplates of matchData) {
			let allSameType = true;
			let relativePieces: IGamePiece[] = [ gamePiece ];
			for (let similarGamePiece of matchTemplates) {
				let relativePiece = gamePiece.relativePiece(similarGamePiece);
				relativePieces.push(relativePiece);
				if (type !== relativePiece.type) {
					allSameType = false;
					break;
				}
			}
			if (allSameType) {
				matches.push(new Match(relativePieces));
			}
		}
		return matches;
	}

	private mergeAndDedupeMatches(matches: Match[]) {
		let mergeMade = false;
		do {
			mergeMade = false;
			for (let i = 0; i < matches.length; i++) {
				let m1 = matches[i];
				for (let j = i + 1; j < matches.length; j++) {
					let m2 = matches[j];
					if (m1.merge(m2)) {
						mergeMade = true;
						matches.splice(j, 1);
						j--;
					}
				}
			}
		} while (mergeMade)
		return matches;
	}

	private findAndRemoveAllMatches() {
		const matches = this.findAllMatches();
		for (let match of matches) {
			if (match.numOfAKind > 3) {
				const center = match.getCenter();
				const extraTurn = PIXI.Sprite.fromImage('/images/extra-turn.svg');
				this.addChild(extraTurn);
				extraTurn.anchor.x = extraTurn.anchor.y = 0.5;
				const etX = center.x - this.x;
				const etY = center.y - this.y;
				extraTurn.position.set(etX, etY);
				TweenManager.Instance.createTween(extraTurn)
					.time(1000)
					.easing(Easing.OutCubic)
					.to({ y: etY - 100 })
					.start()
					.chain()
					.time(300)
					.to({ alpha: 0, y: etY - 150 })
					.on('end', () => {
						this.removeChild(extraTurn);
					})
				;
			}
			this.numMovingGamePieces += match.gamePieces.size;
			for (let gamePiece of match.gamePieces) {
				gamePiece.removeAfterCascade = true;
				gamePiece.interactive = false;
				this.gamePiecesToRemove.add(gamePiece);

				TweenManager.Instance.createTween(gamePiece)
					.time(300)
					.easing(Easing.OutCubic)
					.to({ alpha: 0, scale: { x: 0, y: 0 } })
					.start()
					.on('end', () => {
						this.numMovingGamePieces--;
						if (this.numMovingGamePieces === 0) {
							this.cascade();
						}
					})
				;
			}
		}
	}

	private cascade() {
		const newBoardPositions = new Map<IGamePiece, PIXI.Point>();
		const numMissingPiecesPerColumn = new Map<number, number>();

		for (let gamePiece of this.gamePiecesToRemove) {
			const column = gamePiece.boardPosition.x;
			const numMissingPieces = numMissingPiecesPerColumn.get(column) || 0;
			numMissingPiecesPerColumn.set(column, numMissingPieces + 1);

			let above = gamePiece.above;
			while (above.isOnBoard) {
				if (above.removeAfterCascade) {
					above = above.above;
					continue;
				}
				let newBoardPosition = newBoardPositions.get(above);
				if (newBoardPosition == undefined) {
					newBoardPosition = above.boardPosition.clone();
					newBoardPositions.set(above, newBoardPosition);
				}
				newBoardPosition.y++;
				above = above.above;
			}
		}

		this.numMovingGamePieces += newBoardPositions.size;
		for (let [gamePiece, newBoardPosition] of newBoardPositions) {
			gamePiece.boardPosition = newBoardPosition;
			this.gamePieces[newBoardPosition.y][newBoardPosition.x] = gamePiece;
			const newPosition = GamePiece.BoardPositionToPosition(newBoardPosition);
			TweenManager.Instance.createTween(gamePiece)
				.time(300)
				.easing(Easing.OutCubic)
				.to(newPosition)
				.start()
				.on('end', () => {
					this.numMovingGamePieces--;
					if (this.numMovingGamePieces === 0) {
						this.findAndRemoveAllMatches();
					}
				})
			;
		}

		let numMissingPiecesInColumn = 0;
		let yOffset = 0;
		let column = NaN;
		const iter = numMissingPiecesPerColumn.entries();
		this.numMovingGamePieces += this.gamePiecesToRemove.size;
		for (let gamePiece of this.gamePiecesToRemove) {
			if (numMissingPiecesInColumn === 0) {
				[column, numMissingPiecesInColumn] = iter.next().value;
				yOffset = -(numMissingPiecesInColumn * GamePiece.GamePieceSize + GamePiece.HalfGamePieceSize);
			}

			gamePiece.type = GamePiece.GetRandomType([GamePieceType.None]);
			gamePiece.alpha = 1;
			gamePiece.texture = GamePiece.GetTexture(gamePiece.type);
			// Change width/height instead of scale to 1; behavior of scale changes
			// depending on if a new texture had to be loaded above
			gamePiece.width = gamePiece.height = GamePiece.GamePieceSize;

			const row = numMissingPiecesInColumn - 1;
			gamePiece.boardPosition.x = column;
			gamePiece.boardPosition.y = row;
			this.gamePieces[row][column] = gamePiece;

			let newPosition = GamePiece.BoardPositionToPosition(gamePiece.boardPosition);
			gamePiece.position.x = newPosition.x;
			gamePiece.position.y = newPosition.y + yOffset;

			TweenManager.Instance.createTween(gamePiece)
				.time(300)
				.easing(Easing.OutCubic)
				.to(newPosition)
				.start()
				.on('end', () => {
					this.numMovingGamePieces--;
					if (this.numMovingGamePieces === 0) {
						this.findAndRemoveAllMatches();
					}
				})
			;

			gamePiece.removeAfterCascade = false;
			gamePiece.interactive = true;
			numMissingPiecesInColumn--;
		}

		this.gamePiecesToRemove.clear();
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