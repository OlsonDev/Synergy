'use strict';
import { Keyboard } from './input';

function _setup() {
	const electron = require('electron');
	const win = electron.remote.getCurrentWindow();

	Keyboard.bind(['f12'], (e: keyboardjs.KeyEvent) => {
		win.webContents.openDevTools();
	});

	document.body.addEventListener('click', (e) => {
		if (e.button != 1) return;
		win.webContents.inspectElement(e.x, e.y);
	});
}

let hasSetup = false;

export namespace DevTools {
	export function setup() {
		if (hasSetup) return;
		_setup();
		hasSetup = true;
	}
}