import { IRGBColor } from 'typings';
import { CIRC, FF, HALF, Hundred } from '../const';
import { validNum } from '../math/valid';

export const rgb2hsl = (rgb: IRGBColor) => {
	const r = rgb.r / FF;
	const g = rgb.g / FF;
	const b = rgb.b / FF;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const diff = max - min;

	const l = (max + min) / 2;

	const h = diff === 0 ?
		0 :
		max === r ?
			(g - b) / diff :
			max === g ?
				(b - r) / diff + 2 :
				(r - g) / diff + 4;

	const s = diff === 0 ?
		0 :
		l < HALF ?
			diff / (l * 2) :
			diff / (2 - l * 2);

	return { h: validNum(CIRC, (h + CIRC) % 6 * (CIRC / 6)), s: validNum(Hundred, s * Hundred), l: validNum(Hundred, l * Hundred) };
};
