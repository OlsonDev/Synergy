'use strict';

import { Unit } from '../models/unit';
import { UnitStatType } from '../models/unit-stats';
import { CardStat } from './card-stat';

export class UnitBattleCard extends PIXI.Container {
	static Width = 240;
	static Height = 480;

	private portrait: PIXI.Sprite;
	private frame: PIXI.Sprite;
	private health: CardStat;
	private armor : CardStat;
	private power : CardStat;
	private magic : CardStat;

	constructor(public unit: Unit) {
		super();
		this.addChild(this.portrait = PIXI.Sprite.fromImage(UnitBattleCard.getPortrait(unit.code)));
		this.addChild(this.frame = PIXI.Sprite.fromImage('/images/battle-frame.svg'));
		this.addChild(this.health = new CardStat(UnitStatType.Health, unit.health));
		this.addChild(this.armor  = new CardStat(UnitStatType.Armor , unit.armor));
		this.addChild(this.power  = new CardStat(UnitStatType.Power , unit.power));
		this.addChild(this.magic  = new CardStat(UnitStatType.Magic , unit.magic));

		this.portrait.position.set(0, -10);
		this.health.position.set(25, 205);
		this.armor.position.set(135, 205);
		this.power.position.set(25, 285);
		this.magic.position.set(135, 285);

		this.unit.on('damage', (e) => {
			console.log('damage; DamageEventData: ', e);
		});
	}

	private static getPortrait(unitCode: string) {
		// TODO: Provide a proper implementation
		return '/images/portrait.svg';
	}
}