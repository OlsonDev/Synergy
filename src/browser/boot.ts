'use strict';

import { Cleanup } from './components/misc/cleanup';
import { Titlebar } from './components/misc/titlebar';
import { DevTools } from './components/misc/dev-tools';

Cleanup.setup();
Titlebar.setup();
DevTools.setup();

import * as PIXI from 'pixi.js';
import { Board } from './components/board';
import { FpsCounter } from './components/fps-counter';

const game = document.getElementById('game') as HTMLDivElement;
const renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight, {
	backgroundColor: 0x6495ED
});
game.appendChild(renderer.view);

const stage = new PIXI.Container();
const board = new Board();
const fpsCounter = new FpsCounter();
stage.addChild(board);
stage.addChild(fpsCounter);

PIXI.ticker.shared.add((time) => renderer.render(stage));