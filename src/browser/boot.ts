'use strict';

import { Cleanup } from './components/misc/cleanup';
import { Titlebar } from './components/misc/titlebar';
import { DevTools } from './components/misc/dev-tools';

Cleanup.setup();
Titlebar.setup();
DevTools.setup();

import * as PIXI from 'pixi.js';
import { Party, PartyUnits } from './models/party';
import { BattleScene } from './components/scenes/battle-scene';
import { Unit } from './models/unit';
import { UnitService } from './services/unit-service';
import { UnitBattleCard } from './components/unit-battle-card';
import { FpsCounter } from './components/fps-counter';
import { TweenManager } from './tween/tween-manager';

const game = document.getElementById('game') as HTMLDivElement;
const renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight, {
	backgroundColor: 0x6495ED
});
game.appendChild(renderer.view);

const stage = new PIXI.Container();

const barb1 = Unit.getByCode('barbarian');
const paly1 = Unit.getByCode('paladin');
const amzn1 = Unit.getByCode('amazon');
const sorc1 = Unit.getByCode('sorceress');
const leftParty = new Party([ barb1, paly1, amzn1, sorc1 ]);

const barb2 = Unit.getByCode('barbarian');
const paly2 = Unit.getByCode('paladin');
const amzn2 = Unit.getByCode('amazon');
const sorc2 = Unit.getByCode('sorceress');
const rightParty = new Party([ barb2, paly2, amzn2, sorc2 ]);

const battleScene = new BattleScene(leftParty, rightParty);
stage.addChild(battleScene);

const fpsCounter = new FpsCounter();
stage.addChild(fpsCounter);

PIXI.ticker.shared.add((time) => {
	renderer.render(stage);
	TweenManager.Instance.update();
});