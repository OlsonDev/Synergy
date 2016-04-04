'use strict';

import { IGamePiece, GamePieceType } from '../components/game-piece';

export class Match {
	private _type: GamePieceType;
	private _numOfAKind: number;
	gamePieces: Set<IGamePiece>;

	get numPieces() { return this.gamePieces.size; }
	get numOfAKind() { return this._numOfAKind; }
	get type() { return this._type; }

	constructor(gamePieces: IGamePiece[] | Set<IGamePiece>) {
		this.gamePieces = new Set(gamePieces);
		this._numOfAKind = this.gamePieces.size;
		this._type = this.gamePieces.values().next().value.type;
	}

	private canMerge(other: Match) {
		if (this.type !== other.type) return false;
		for (let ogp of other.gamePieces) {
			if (this.gamePieces.has(ogp)) return true;
		}
		return false;
	}

	merge(other: Match) {
		if (!this.canMerge(other)) return false;
		for (let ogp of other.gamePieces) {
			this.gamePieces.add(ogp);
		}
		this._numOfAKind = Math.min(this.numPieces, 5);
		return true;
	}
}