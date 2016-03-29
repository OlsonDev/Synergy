'use strict';

export enum MoveDirection { Up,	Down, Left, Right }

export class PotentialMatch {
	SimilarGamePieces: PIXI.Point[];
	MoveDirection: MoveDirection;
}

export class MatchData {
	Match3 = MatchData.ExpandBothAxes([[-2, -1], [-1, +1], [+1, +2]]);
	Match4 = MatchData.ExpandBothAxes([[-3, -2, -1], [-2, -1, +1], [-1, +1, +2], [+1, +2, +3]]);

	PotentialMatch3: any; // TODO
	PotentialMatch4: any; // TODO
	PotentialMatch5: any; // TODO

	private static ExpandBothAxes(matches: number[][]) {
		const expanded: PIXI.Point[][] = [];
		for (let match of matches) {
			let x: PIXI.Point[] = [];
			let y: PIXI.Point[] = [];
			expanded.push(x);
			expanded.push(y);
			for (let delta of match) {
				x.push(new PIXI.Point(delta, 0));
				y.push(new PIXI.Point(0, delta));
			}
		}
		return expanded;
	}
}