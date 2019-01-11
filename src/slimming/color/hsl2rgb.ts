import { validNum } from './valid';

const Circ = 360;
const Circ6 = 60;
const half = 0.5;
const FF = 255;

export function hsl2rgb(h: number, s: number, l: number): number[] {
	let _R: number, G: number, B: number, X: number, C: number;
	let _h = (h % Circ) / Circ6;
	C = s * 2 * (l < half ? l : 1 - l);
	X = C * (1 - Math.abs(_h % 2 - 1));
	_R = G = B = l - C / 2;

	_h = ~~_h;
	_R += [C, X, 0, 0, X, C][_h];
	G += [X, C, C, X, 0, 0][_h];
	B += [0, 0, X, C, C, X][_h];
	return [validNum(FF, _R * FF), validNum(FF, G * FF), validNum(FF, B * FF)];
}
