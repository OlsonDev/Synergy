'use strict';

export enum UnitColor {
	Red,
	Yellow,
	Green,
	Blue,
	Purple,
	Brown
}

export interface UnitColors extends Array<number> {
	0: UnitColor;
	1: UnitColor;
}