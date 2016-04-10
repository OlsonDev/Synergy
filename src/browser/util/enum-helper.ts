'use strict';

// Sample generated code:
// GamePieceType[GamePieceType["Red"] = 0] = "Red";
// GamePieceType[GamePieceType["Yellow"] = 1] = "Yellow";
// GamePieceType[GamePieceType["Green"] = 2] = "Green";
// GamePieceType[GamePieceType["Blue"] = 3] = "Blue";
// GamePieceType[GamePieceType["Purple"] = 4] = "Purple";
// GamePieceType[GamePieceType["Brown"] = 5] = "Brown";

export function getRandomEnum<E>(e: any, disallowedValues?: any[]): E {
	return disallowedValues && disallowedValues.length
		? getRandomEnumExcept<E>(e, disallowedValues)
		: getAnyRandomEnum<E>(e)
	;
}

export function getAnyRandomEnum<E>(e: any): E {
	const keys = Object.keys(e);
	const index = Math.floor(Math.random() * keys.length);
	const key = keys[index];
	return typeof e[key] === 'number' ? <any>e[key] : <any>parseInt(key, 10);
}

export function getRandomEnumExcept<E>(e: any, disallowedValues: any[]): E {
	const allowedValues = Object.assign({}, e);
	// disallowedValues likely only includes numbers or strings; ensure both disallowed
	for (let value of disallowedValues) {
		delete allowedValues[value];
		delete allowedValues[e[value]];
	}
	return getRandomEnum<E>(allowedValues);
}

export function getEnumNames<E>(e: any) {
	return Object.keys(e).filter(v => isNaN(parseInt(v)));
}

export function getEnumValues<E>(e: any) {
	return Object.keys(e).map(v => parseInt(v)).filter(v => !isNaN(v));
}

export function getNamesAndValues<E>(e: any) {
	return getEnumValues(e).map(v => { return { name: e[v] as string, value: v }; });
}