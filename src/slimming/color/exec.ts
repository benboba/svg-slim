import { shortenFunc } from '../utils/shorten-func';
import { angel, numberPattern } from '../const/syntax';
import { keywords } from './keywords';
import { valid, validOpacity } from './valid';
import { hsl2rgb } from './hsl2rgb';
import { has } from 'ramda';
import { toFixed } from '../math/tofixed';
import { OPACITY_DIGIT, Hex, Hundred, FF, CIRC, GRAD, RAD } from '../const';

const rgbReg = new RegExp(`rgba?\\((${numberPattern})(%?),(${numberPattern})(%?),(${numberPattern})(%?)(?:,(${numberPattern})(%?))?\\)`, 'gi');
const hslReg = new RegExp(`hsla?\\((${numberPattern})((?:${angel})?),(${numberPattern})%,(${numberPattern})%(?:,(${numberPattern})(%?))?\\)`, 'gi');
const hexReg = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const fixed3 = toFixed(OPACITY_DIGIT);

const alphaMap = {
	'255': 100,
	'252': 99,
	'250': 98,
	'247': 97,
	'245': 96,
	'242': 95,
	'240': 94,
	'237': 93,
	'235': 92,
	'232': 91,
	'230': 90,
	'227': 89,
	'224': 88,
	'222': 87,
	'219': 86,
	'217': 85,
	'214': 84,
	'212': 83,
	'209': 82,
	'207': 81,
	'204': 80,
	'201': 79,
	'199': 78,
	'196': 77,
	'194': 76,
	'191': 75,
	'189': 74,
	'186': 73,
	'184': 72,
	'181': 71,
	'179': 70,
	'176': 69,
	'173': 68,
	'171': 67,
	'168': 66,
	'166': 65,
	'163': 64,
	'161': 63,
	'158': 62,
	'156': 61,
	'153': 60,
	'150': 59,
	'148': 58,
	'145': 57,
	'143': 56,
	'140': 55,
	'138': 54,
	'135': 53,
	'133': 52,
	'130': 51,
	'128': 50,
	'125': 49,
	'122': 48,
	'120': 47,
	'117': 46,
	'115': 45,
	'112': 44,
	'110': 43,
	'107': 42,
	'105': 41,
	'102': 40,
	'99': 39,
	'97': 38,
	'94': 37,
	'92': 36,
	'89': 35,
	'87': 34,
	'84': 33,
	'82': 32,
	'79': 31,
	'77': 30,
	'74': 29,
	'71': 28,
	'69': 27,
	'66': 26,
	'64': 25,
	'61': 24,
	'59': 23,
	'56': 22,
	'54': 21,
	'51': 20,
	'48': 19,
	'46': 18,
	'43': 17,
	'41': 16,
	'38': 15,
	'36': 14,
	'33': 13,
	'31': 12,
	'28': 11,
	'26': 10,
	'23': 9,
	'20': 8,
	'18': 7,
	'15': 6,
	'13': 5,
	'10': 4,
	'8': 3,
	'5': 2,
	'3': 1,
	'0': 0,
};

export const exec = (color: string): IRGBColor => {
	let _color = shortenFunc(color.trim());

	// 首先把关键字转为 16 位色
	if (keywords.hasOwnProperty(color)) {
		_color = keywords[color as keyof typeof keywords];
	}

	const result = {
		r: 0,
		g: 0,
		b: 0,
		a: 1,
		origin: _color,
		valid: true,
	};

	// 16 位色直接解析
	const hexMatch = _color.match(hexReg);
	if (hexMatch) {
		const hex = hexMatch[1];
		switch (hex.length) {
			case 3:
				result.r = parseInt(`0x${hex[0]}${hex[0]}`, Hex);
				result.g = parseInt(`0x${hex[1]}${hex[1]}`, Hex);
				result.b = parseInt(`0x${hex[2]}${hex[2]}`, Hex);
				break;
			case 4:
				result.r = parseInt(`0x${hex[0]}${hex[0]}`, Hex);
				result.g = parseInt(`0x${hex[1]}${hex[1]}`, Hex);
				result.b = parseInt(`0x${hex[2]}${hex[2]}`, Hex);
				const alpha4 = parseInt(`0x${hex[3]}${hex[3]}`, Hex);
				result.a = has(`${alpha4}`, alphaMap) ? alphaMap[`${alpha4}` as keyof typeof alphaMap] / Hundred : fixed3(alpha4 / FF);
				break;
			case 8:
				result.r = parseInt(`0x${hex[0]}${hex[1]}`, Hex);
				result.g = parseInt(`0x${hex[2]}${hex[3]}`, Hex);
				result.b = parseInt(`0x${hex[4]}${hex[5]}`, Hex);
				const alpha8 = parseInt(`0x${hex[6]}${hex[7]}`, Hex);
				result.a = has(`${alpha8}`, alphaMap) ? alphaMap[`${alpha8}` as keyof typeof alphaMap] / Hundred : fixed3(alpha8 / FF);
				break;
			default:
				result.r = parseInt(`0x${hex[0]}${hex[1]}`, Hex);
				result.g = parseInt(`0x${hex[2]}${hex[3]}`, Hex);
				result.b = parseInt(`0x${hex[4]}${hex[5]}`, Hex);
				break;
		}
		return result;
	}

	// rgb/rgba/hsl/hsla 解析
	rgbReg.lastIndex = 0; // 重置正则表达式匹配位置
	const rgbMatch = rgbReg.exec(_color);
	if (rgbMatch) {
		if (rgbMatch[2] === rgbMatch[4] && rgbMatch[4] === rgbMatch[6]) {
			result.r = valid(rgbMatch[2], FF, rgbMatch[1]);
			result.g = valid(rgbMatch[4], FF, rgbMatch[3]);
			result.b = valid(rgbMatch[6], FF, rgbMatch[5]);
			if (rgbMatch[7]) {
				result.a = validOpacity(OPACITY_DIGIT, rgbMatch[8], rgbMatch[7]);
			}
		} else {
			result.valid = false;
		}
		return result;
	}

	hslReg.lastIndex = 0;
	const hslMatch = hslReg.exec(_color);
	if (hslMatch) {
		let hue: number;
		switch (hslMatch[2].toLowerCase()) {
			case 'grad':
				hue = +hslMatch[1] * CIRC / GRAD;
				break;
			case 'rad':
				hue = +hslMatch[1] * CIRC / RAD;
				break;
			case 'turn':
				hue = +hslMatch[1] * CIRC;
				break;
			default: // deg 和纯数值都按照 360 解析
				hue = +hslMatch[1];
				break;
		}
		[result.r, result.g, result.b] = hsl2rgb(hue, +hslMatch[3] / Hundred, +hslMatch[4] / Hundred);
		if (hslMatch[5]) {
			result.a = validOpacity(OPACITY_DIGIT, hslMatch[6], hslMatch[5]);
		}
		return result;
	}

	result.valid = false;
	return result;
};
