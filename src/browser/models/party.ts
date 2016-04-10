'use strict';

import { Unit } from './unit';

export enum UnitPartyPosition {
	FrontLeft,
	FrontRight,
	BackLeft,
	BackRight
}

export interface PartyUnits extends Array<Unit> {
	0: Unit;
	1: Unit;
	2: Unit;
	3: Unit;
}

export class Party {
	constructor(private units: PartyUnits) {}

	unitAtPosition(position: UnitPartyPosition) {
		return this.units[position] || null;
	}

	get frontLeft () { return this.units[UnitPartyPosition.FrontLeft]; }
	get frontRight() { return this.units[UnitPartyPosition.FrontRight]; }
	get backLeft  () { return this.units[UnitPartyPosition.BackLeft]; }
	get backRight () { return this.units[UnitPartyPosition.BackRight]; }

	set frontLeft (value) { this.units[UnitPartyPosition.FrontLeft] = value; }
	set frontRight(value) { this.units[UnitPartyPosition.FrontRight] = value; }
	set backLeft  (value) { this.units[UnitPartyPosition.BackLeft] = value; }
	set backRight (value) { this.units[UnitPartyPosition.BackRight] = value; }
}