'use strict';

export enum UnitColor {
	  Red    = 0
	, Yellow = 1 << 0
	, Green  = 1 << 1
	, Blue   = 1 << 2
	, Purple = 1 << 3
	, Brown  = 1 << 4
}

export interface UnitColors extends Array<number> {
	0: UnitColor;
	1: UnitColor;
}