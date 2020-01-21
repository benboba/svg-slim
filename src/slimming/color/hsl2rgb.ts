import { CIRC, FF, HALF } from '../const';
import { validNum } from '../math/valid';

const CIRC6 = CIRC / 6;

export const hsl2rgb = (h: number, s: number, l: number): number[] => {
	let _R: number;
	let G: number;
	let B: number;
	let X: number;
	let C: number;
	let _h = (h % CIRC) / CIRC6;
	C = s * 2 * (l < HALF ? l : 1 - l);
	X = C * (1 - Math.abs(_h % 2 - 1));
	_R = G = B = l - C / 2;

	_h = ~~_h;
	_R += [C, X, 0, 0, X, C][_h];
	G += [X, C, C, X, 0, 0][_h];
	B += [0, 0, X, C, C, X][_h];
	return [validNum(FF, _R * FF), validNum(FF, G * FF), validNum(FF, B * FF)];
};
