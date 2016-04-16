'use strict';

import keyboard, { Keyboard, EventHandler, KeyEvent } from 'keyboardjs/index';

class ExtendedKeyboard extends Keyboard {
	keydownOnce(keys: string | string[], callback: typeof EventHandler)  {
		let keyPressed = false;
		return this.bind(keys
			, (e: typeof KeyEvent) => {
				if (keyPressed) return;
				keyPressed = true;
				callback(e);
			}
			, () => keyPressed = false
		);
	}
}

const extended = keyboard as any as ExtendedKeyboard;
extended.keydownOnce = ExtendedKeyboard.prototype.keydownOnce;

export { extended as Keyboard };