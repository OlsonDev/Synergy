'use strict';

console.log('booting');

import { Cleanup } from './components/misc/cleanup';
import { Titlebar } from './components/misc/titlebar';
import { DevTools } from './components/misc/dev-tools';
import { Board } from './components/board';

Cleanup.setup();
Titlebar.setup();
DevTools.setup();

import * as PIXI from "pixi.js";


const game = document.getElementById('game') as HTMLDivElement;
const renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight, {
	backgroundColor: 0x6495ED
});
game.appendChild(renderer.view);
const stage = new PIXI.Container();

const board = new Board();
stage.addChild(board);

animate();

function animate() {
	requestAnimationFrame(animate);
	renderer.render(stage);
}

console.log('booted');