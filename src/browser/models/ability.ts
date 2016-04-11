'use strict';

import { InstructionSet } from './instructions/instruction';

export class Ability {
	private constructor(
		private code: string,
		private instructions: InstructionSet,
		private aiChanceInstructions: InstructionSet
	) {}

	static getByCode(code: string) {
		const instructions = Ability.getInstructions(code);
		const aiChanceInstructions = Ability.getAiChanceInstructions(code);
		const ability = new Ability(code, instructions, aiChanceInstructions);
		return ability;
	}

	private static getInstructions(code: string) {
		const source = '';
		return InstructionSet.Parse(source);
	}

	private static getAiChanceInstructions(code: string) {
		const source = '';
		return InstructionSet.Parse(source);
	}
}