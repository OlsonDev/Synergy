'use strict';
import { Keyboard } from './input';
import { KeyEvent } from 'keyboardjs/index';

function _setup() {
	const electron = require('electron');
	const win = electron.remote.getCurrentWindow();

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

	Keyboard.keydownOnce(['esc', 'alt'], (e: typeof KeyEvent) => {
		document.body.classList.toggle('paused');
	});
}

let hasSetup = false;

export namespace Titlebar {
	export function setup() {
		if (hasSetup) return;
		_setup();
		hasSetup = true;
	}
}