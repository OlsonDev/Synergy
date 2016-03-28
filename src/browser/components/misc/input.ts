'use strict';

import * as kb from 'keyboardjs/index';
const keyboard = kb.default;

keyboard.bind.keydownOnce = function(keys: string | string[], callback: () => void) {
	let keyPressed = false;
	return kb.default.bind(keys
		, () => {
			if (keyPressed) return;
			keyPressed = true;
			if (typeof callback === 'function') callback();
		}
		, () => keyPressed = false
	);
};

export { keyboard as Keyboard };