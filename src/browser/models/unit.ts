'use strict';

import { UnitStats, StatTarget } from './unit-stats';
import { UnitColor, UnitColors } from './unit-color';
import { I18n } from '../services/i18n';
import { UnitService } from '../services/unit-service';

export class Unit extends PIXI.utils.EventEmitter {
	private _code: string;
	private _name: string;
	private _initialStats: UnitStats;
	private _currentStats: UnitStats;
	private _colors: [ UnitColor, UnitColor ];

	static getByCode(code: string) {
		const name = I18n.get(`unit.name.${code}`);
		const colors = UnitService.getColors(code);
		const stats = UnitService.getInitialStats(code);
		return new Unit(code, name, colors, stats);
	}

	constructor(code: string, name: string, colors: UnitColors, stats: UnitStats) {
		super();
		this._code = code;
		this._name = name;
		this._initialStats = stats;
		this._currentStats = stats.clone();
	}



	get code() { return this._code; }
	get name() { return this._name || this._code; }
	get colors() { return this._colors; }

	get health() { return this._currentStats.health; }
	get armor () { return this._currentStats.armor; }
	get magic () { return this._currentStats.magic; }
	get power () { return this._currentStats.power; }

	takeDamage(amount: number, type: StatTarget = StatTarget.ArmorThenHealth) {
		this.emit('before-damage', { amount, type });
		switch (type) {
			case StatTarget.Health:
				this._currentStats.health -= amount;
				this.checkAlive();
				break;
			case StatTarget.Armor:
				this._currentStats.armor -= amount;
				break;
			case StatTarget.Power:
				this._currentStats.power -= amount;
				break;
			case StatTarget.Magic:
				this._currentStats.magic -= amount;
				break;
			case StatTarget.ArmorThenHealth:
				const remainder = Math.max(0, this._currentStats.armor - amount);
				this._currentStats.armor -= amount;
				this._currentStats.health -= remainder;
				this.checkAlive();
				break;
		}
		this.emit('damage', { amount, type });
	}

	checkAlive() {
		if (this._currentStats.health) return;
		this.emit('death');
	}
}