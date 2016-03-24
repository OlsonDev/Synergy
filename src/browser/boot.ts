'use strict';

const electron = require('electron');
const win = electron.remote.getCurrentWindow();
window.addEventListener('beforeunload', () => win.removeAllListeners());

function getButtonAndBindClick(btn: string, fn: EventListener) {
	const elem = document.getElementById(`btn-${btn}`);
	elem.addEventListener('click', fn);
	return elem;
}

const btnMinimize = getButtonAndBindClick('minimize', () => win.minimize());
const btnMaximize = getButtonAndBindClick('maximize', () => win.maximize());
const btnRestore  = getButtonAndBindClick('restore' , () => win.restore());
const btnClose    = getButtonAndBindClick('close'   , () => win.close());

function updateButtons() {
	const isMax = win.isMaximized();
	btnMaximize.hidden = isMax;
	btnRestore.hidden = !isMax;
}

win.on('unmaximize', updateButtons);
win.on('maximize', updateButtons);
updateButtons();

const game = document.getElementById('game') as HTMLDivElement;
const canvas = document.getElementById('layer-0') as HTMLCanvasElement;
const ctx = canvas.getContext('webgl') as WebGLRenderingContext;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.viewport(0, 0, ctx.drawingBufferWidth, ctx.drawingBufferHeight);