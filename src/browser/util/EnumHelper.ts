'use strict';

export function getRandomEnum<E>(e: any): E {
	const keys = Object.keys(e);
	const index = Math.floor(Math.random() * keys.length);
	const key = keys[index];
	return typeof e[key] === 'number' ? <any>e[key] : <any>parseInt(key, 10);
}