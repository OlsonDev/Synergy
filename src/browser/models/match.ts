'use strict';

import { IGamePiece, GamePieceType } from '../components/game-piece';
import { PseudoPixiContainer } from '../util/pseudo-pixi-container';

export class Match {
	private _type: GamePieceType;
	private _numOfAKind: number;
	private _bounds: PIXI.Rectangle;
	private _center: PIXI.Point;
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
		this._bounds = null;
		this._center = null;
		return true;
	}

	getBounds() {
		if (this._bounds) return this._bounds;
		const ctnr = new PseudoPixiContainer();
		ctnr.addChild(...this.gamePieces);
		return this._bounds = ctnr.getBounds();
	}

	getCenter() {
		if (this._center) return this._center;
		const bounds = this.getBounds();
		const cx = bounds.x + bounds.width / 2;
		const cy = bounds.y + bounds.height / 2;
		return this._center = new PIXI.Point(cx, cy);
	}
}