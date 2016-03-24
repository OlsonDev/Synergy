'use strict';

console.log('booting');
const nodeModules = process.execPath.replace(/node_modules[\\/].*$/, 'node_modules');
require('module').globalPaths.push(nodeModules);

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

const kb = require('keyboardjs');
kb.bind.keydownOnce = function(keys: string | string[], callback: () => void) {
	let keyPressed = false;
	return kb.bind(keys
		, () => {
			if (keyPressed) return;
			keyPressed = true;
			if (typeof callback === 'function') callback();
		}
		, () => keyPressed = false
	);
};


kb.bind.keydownOnce(['esc', 'alt'], (e: keyboardjs.KeyEvent) => {
	document.body.classList.toggle('paused');
});

kb.bind(['f12'], (e: keyboardjs.KeyEvent) => {
	console.log('f12');
	win.webContents.openDevTools();
});

document.body.addEventListener('click', (e) => {
	if (e.button != 1) return;
	win.webContents.inspectElement(e.x, e.y);
});

console.log('booted');