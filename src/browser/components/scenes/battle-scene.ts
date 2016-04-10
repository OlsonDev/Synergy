'use strict';

import { Board } from '../board';
import { Party } from '../../models/party';
import { BattleParty, PartySide } from '../battle-party';


export class BattleScene extends PIXI.Container {
	board: Board;
	leftBattleParty: BattleParty;
	rightBattleParty: BattleParty;

	constructor(private leftParty: Party, private rightParty: Party) {
		super();

		this.addChild(this.board = new Board());
		this.addChild(this.leftBattleParty = new BattleParty(leftParty, PartySide.Left));
		this.addChild(this.rightBattleParty = new BattleParty(leftParty, PartySide.Right));

		this.leftBattleParty.y = this.rightBattleParty.y = this.board.y;
		this.rightBattleParty.x = this.board.x + this.board.width;

		console.log(this.board);
	}
}