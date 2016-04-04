'use strict';

export class PseudoPixiContainer extends PIXI.Container {
	// Want to use PIXI.Container.getBounds
	// but don't want to steal children from real parents
	addChild(...child: PIXI.DisplayObject[]) {
		this.children.push(...child);
		return child;
	}
}