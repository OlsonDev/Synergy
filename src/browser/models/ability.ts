'use strict';

import { InstructionSet } from './instructions/instruction';

export class Ability {
	private constructor(
		private code: string,
		private executeFn: Function,
		private aiChanceFn: Function
	) {}

	static getByCode(code: string) {
		const executeFn = Ability.getExecuteFn(code);
		const aiChanceFn = Ability.getAiChanceFn(code);
		return new Ability(code, executeFn, aiChanceFn);
	}

	private static getExecuteFn(code: string) {
		const source = '';
		return new Function(source);
	}

	private static getAiChanceFn(code: string) {
		const source = '';
		return new Function(source);
	}
}

export class AbilityContext {

}