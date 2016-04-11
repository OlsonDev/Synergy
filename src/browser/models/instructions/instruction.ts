'use strict';

import { Unit } from '../unit';
import { StatTarget } from '../unit-stats';
import { UnitColor } from '../unit-color';
import { IGamePiece } from '../../components/game-piece';
import { Fraction } from '../../util/math-helper';

export abstract class Instruction {
	abstract invoke(context: InstructionContext): void;
}

export class InstructionContext {
	value = 0;
	valueMax = 0;
	targets: Unit[] = [];
	isRange: boolean;
	boost: Fraction;
	statTargets: StatTarget;
	colorsSelected: UnitColor;
	gamePiecesSelected: IGamePiece[];
}

export class InstructionSet extends Array<Instruction> {
	static Parse(source: string) {
		const instructions = [] as InstructionSet;
		return instructions;
	}

	run(context: InstructionContext) {
		for (let instruction of this) {
			instruction.invoke(context);
		}
	}

	private constructor() {
		super();
	}
}