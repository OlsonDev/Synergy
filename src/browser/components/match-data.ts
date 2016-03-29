'use strict';

const quarterClockwiseTurn = -Math.PI / 2;
const cosQuarterClockwiseTurn = Math.cos(quarterClockwiseTurn);
const sinQuarterClockwiseTurn = Math.sin(quarterClockwiseTurn);

// Clockwise order matters for AddRotations algorithm
export enum MoveDirection { Up, Right, Down, Left }

export class PotentialMatch {
	constructor(public MoveDirection: MoveDirection, public SimilarGamePieces: PIXI.Point[]) {}
}

export class MatchData {
	static Match3 = MatchData.ExpandBothAxes([[-2, -1], [-1, +1], [+1, +2]]);
	static Match4 = MatchData.ExpandBothAxes([[-3, -2, -1], [-2, -1, +1], [-1, +1, +2], [+1, +2, +3]]);

	static PotentialMatch3 = MatchData.AddRotations([
		new PotentialMatch(MoveDirection.Up, [new PIXI.Point(-2, -1), new PIXI.Point(-1, -1)]),
		new PotentialMatch(MoveDirection.Up, [new PIXI.Point(-1, -1), new PIXI.Point(+1, -1)]),
		new PotentialMatch(MoveDirection.Up, [new PIXI.Point(+1, -1), new PIXI.Point(+2, -1)]),
		new PotentialMatch(MoveDirection.Up, [new PIXI.Point( 0, -2), new PIXI.Point( 0, -1)])
	]);
	static PotentialMatch4: any; // TODO
	static PotentialMatch5: any; // TODO

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

	private static AddRotations(potentialMatches: PotentialMatch[]) {
		let numPerDirection = potentialMatches.length;
		let numMissingDirections = Object.keys(MoveDirection).length / 2 - 1;
		for (let d = 0; d < numMissingDirections; d++) {
			for (let i = 0; i < numPerDirection; i++) {
				const baseIndex = d * numPerDirection + i;
				const basePotentialMatch = potentialMatches[baseIndex];
				const similarGamePieces: PIXI.Point[] = [];
				for (let sgp of basePotentialMatch.SimilarGamePieces) {
					const x = Math.round(cosQuarterClockwiseTurn * sgp.x + sinQuarterClockwiseTurn * sgp.y);
					const y = Math.round(cosQuarterClockwiseTurn * sgp.y - sinQuarterClockwiseTurn * sgp.x);
					similarGamePieces.push(new PIXI.Point(x, y));
				}
				potentialMatches.push(new PotentialMatch(d + 1 as MoveDirection, similarGamePieces));
			}
		}
		return potentialMatches;
	}
}