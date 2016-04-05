'use strict';

import { UnitStats } from '../models/unit-stats';
import { UnitColor, UnitColors } from '../models/unit-color';
import { getRandomEnum } from '../util/enum-helper';

export class UnitService {
	static getInitialStats(code: string) {
		// TODO: Get from web service / local database
		const stats = new UnitStats();
		stats.health = 10;
		stats.armor = 8;
		stats.power = 5;
		stats.magic = 4;
		return stats;
	}

	static getColors(code: string): UnitColors {
		// TODO: Get from web service / local database
		const c0 = getRandomEnum(UnitColor) as UnitColor;
		const c1 = getRandomEnum(UnitColor) as UnitColor;
		return [ c0, c1 ];
	}
}