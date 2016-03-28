'use strict';

function _setup() {
	const electron = require('electron');
	const win = electron.remote.getCurrentWindow();
	window.addEventListener('beforeunload', () => win.removeAllListeners());
}

let hasSetup = false;

export namespace Cleanup {
	export function setup() {
		if (hasSetup) return;
		_setup();
		hasSetup = true;
	}
}