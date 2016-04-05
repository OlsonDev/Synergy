'use strict';

export enum StatTarget {
	Health,
	Armor,
	Power,
	Magic,
	ArmorThenHealth
}

export class UnitStats {
	private _health: number;
	private _armor: number;
	private _power: number;
	private _magic: number;

	get health() { return this._health; }
	get armor () { return this._armor; }
	get power () { return this._power; }
	get magic () { return this._magic; }

	set health(value) { this._health = value <= 0 ? 0 : value; }
	set armor (value) { this._armor  = value <= 0 ? 0 : value; }
	set power (value) { this._power  = value <= 0 ? 0 : value; }
	set magic (value) { this._magic  = value <= 0 ? 0 : value; }

	clone() {
		const clone = new UnitStats;
		clone._health = this._health;
		clone._armor  = this._armor;
		clone._power  = this._power;
		clone._magic  = this._magic;
		return clone;
	}
}