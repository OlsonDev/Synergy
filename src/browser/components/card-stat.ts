'use strict';

import { UnitStatType } from '../models/unit-stats';

export class CardStat extends PIXI.Container {
	private icon: PIXI.Sprite;
	private text: PIXI.Text;

	constructor(type: UnitStatType, initialAmount: number) {
		super();
		this.icon = CardStat.getIcon(type);
		this.icon.tint = 0x000000;
		this.text = new PIXI.Text(CardStat.format(initialAmount));
		this.text.style = {
			font: '40px Arial',
			fill: '#FFF',
			stroke: '#000',
			strokeThickness: 4,
			align: 'center',
			wordWrap: false
		};

		if (this.icon.texture.hasLoaded) {
			this.iconTextureLoaded();
		} else {
			this.icon.texture.once('update', this.iconTextureLoaded, this);
		}

		this.text.anchor.set(0.5);

		this.addChild(this.icon);
		this.addChild(this.text);
	}

	private update(amount: number) {
		this.text.text = CardStat.format(amount);
	}

	private iconTextureLoaded() {
		this.text.style.lineHeight = this.icon.height;
		this.text.x = this.icon.width / 2;
		this.text.y = this.icon.height / 2;
	}

	private static getIcon(type: UnitStatType) {
		const path = `/images/unit-stat-${UnitStatType[type]}.svg`;
		return PIXI.Sprite.fromImage(path);
	}

	private static format(amount: number) {
		return Math.round(amount).toString();
	}
}