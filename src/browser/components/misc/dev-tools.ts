'use strict';
import { Keyboard } from './input';
import { KeyEvent } from 'keyboardjs/index';

function _setup() {
	const electron = require('electron');
	const win = electron.remote.getCurrentWindow();

	Keyboard.bind(['f12'], (e: typeof KeyEvent) => {
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