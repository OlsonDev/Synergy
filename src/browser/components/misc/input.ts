'use strict';

import kbjs = require('keyboardjs/index');

interface ExtendedKeyboard extends kbjs.Keyboard {
	keydownOnce(keys: string | string[], callback: kbjs.EventHandler): void;
}

const keyboard = kbjs.default as any as ExtendedKeyboard;

keyboard.keydownOnce = function(keys: string | string[], callback: kbjs.EventHandler) {
	let keyPressed = false;
	return this.bind(keys
		, (e) => {
			if (keyPressed) return;
			keyPressed = true;
			callback(e);
		}
		, () => keyPressed = false
	);
};


export { keyboard as Keyboard };