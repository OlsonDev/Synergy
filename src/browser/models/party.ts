'use strict';

import { Unit } from './unit';

export class Party {
	units: [ Unit, Unit, Unit, Unit ];
	get frontLeft () { return this.units[0]; }
	get frontRight() { return this.units[1]; }
	get backLeft  () { return this.units[2]; }
	get backRight () { return this.units[3]; }

	set frontLeft (value) { this.units[0] = value; }
	set frontRight(value) { this.units[1] = value; }
	set backLeft  (value) { this.units[2] = value; }
	set backRight (value) { this.units[3] = value; }
}