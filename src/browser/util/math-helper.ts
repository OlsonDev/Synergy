'use strict';

export function getRandomIntExclusive(min: number, max: number) {
	return Math.floor(min + Math.random() * (max - min));
}

export function getRandomIntInclusive(min: number, max: number) {
	return getRandomIntExclusive(min, max + 1);
}