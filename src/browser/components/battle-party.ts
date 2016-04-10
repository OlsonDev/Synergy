'use strict';

import { Party, UnitPartyPosition } from '../models/party';
import { UnitBattleCard } from './unit-battle-card';
import { getEnumValues } from '../util/enum-helper';

export enum PartySide {
	Left, Right
}

export class BattleParty extends PIXI.Container {
	constructor(private party: Party, private side: PartySide) {
		super();

		const partyPositions = getEnumValues(UnitPartyPosition);
		for (let p of partyPositions) {
			const unit = party.unitAtPosition(p);
			if (!unit) continue;
			const battleCard = new UnitBattleCard(unit);
			battleCard.position = BattleParty.getBattleCardPosition(side, p);
			this.addChild(battleCard);
		}
	}

	private static LBR_RFL = new PIXI.Point(0, 0);
	private static LFR_RBL = new PIXI.Point(UnitBattleCard.Width, 0);
	private static LBL_RFR = new PIXI.Point(0, UnitBattleCard.Height);
	private static LFL_RBR = new PIXI.Point(UnitBattleCard.Width, UnitBattleCard.Height);

	private static getBattleCardPosition(side: PartySide, partyPosition: UnitPartyPosition) {
		// ===========================
		// || BR FR    v      FL BL ||
		// || BL FL     s.    FR BR ||
		// ===========================
		switch (side) {
			case PartySide.Left:
				switch (partyPosition) {
					case UnitPartyPosition.BackRight : return BattleParty.LBR_RFL.clone();
					case UnitPartyPosition.FrontRight: return BattleParty.LFR_RBL.clone();
					case UnitPartyPosition.BackLeft  : return BattleParty.LBL_RFR.clone();
					case UnitPartyPosition.FrontLeft : return BattleParty.LFL_RBR.clone();
				}
				break;
			case PartySide.Right:
				switch (partyPosition) {
					case UnitPartyPosition.FrontLeft : return BattleParty.LBR_RFL.clone();
					case UnitPartyPosition.BackLeft  : return BattleParty.LFR_RBL.clone();
					case UnitPartyPosition.FrontRight: return BattleParty.LBL_RFR.clone();
					case UnitPartyPosition.BackRight : return BattleParty.LFL_RBR.clone();
				}
				break;
		}
		throw new Error(`Could not determine battle card position. Side: ${side}, partyPosition: ${partyPosition}.`);
	}
}