import { has } from 'ramda';
import { CIRC, FF, GRAD, Hex, Hundred, OPACITY_DIGIT, RAD } from '../const';
import { angel, numberPattern } from '../const/syntax';
import { shortenAlpha } from '../math/shorten-alpha';
import { valid, validNum, validOpacity } from '../math/valid';
import { shortenFunc } from '../utils/shorten-func';
import { hsl2rgb } from './hsl2rgb';
import { keywords } from './keywords';

const rgbReg = new RegExp(`^rgba?\\((${numberPattern})(%?),(${numberPattern})\\2,(${numberPattern})\\2(?:,(${numberPattern})(%?))?\\)$`, 'gi');
const hslReg = new RegExp(`^hsla?\\((${numberPattern})((?:${angel})?),(${numberPattern})%,(${numberPattern})%(?:,(${numberPattern})(%?))?\\)$`, 'gi');
const hexReg = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

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

export const execColor = (color: string, digit = OPACITY_DIGIT): IRGBColor => {
	// 首先对原始字符串进行基本的格式处理和类型转换
	let _color = color.trim();
	if (keywords.hasOwnProperty(_color)) {
		// 关键字转为 16 位色
		_color = keywords[_color as keyof typeof keywords];
	} else if (/^(?:rgb|hsl)a?\s*\(/.test(_color)) {
		// 缩短函数类
		_color = shortenFunc(_color);
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
				result.a = has(`${alpha4}`, alphaMap) ? alphaMap[`${alpha4}` as keyof typeof alphaMap] / Hundred : alpha4 / FF;
				break;
			case 8:
				result.r = parseInt(`0x${hex[0]}${hex[1]}`, Hex);
				result.g = parseInt(`0x${hex[2]}${hex[3]}`, Hex);
				result.b = parseInt(`0x${hex[4]}${hex[5]}`, Hex);
				const alpha8 = parseInt(`0x${hex[6]}${hex[7]}`, Hex);
				result.a = has(`${alpha8}`, alphaMap) ? alphaMap[`${alpha8}` as keyof typeof alphaMap] / Hundred : alpha8 / FF;
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
		result.r = valid(rgbMatch[2], FF, rgbMatch[1]);
		result.g = valid(rgbMatch[2], FF, rgbMatch[3]);
		result.b = valid(rgbMatch[2], FF, rgbMatch[4]);
		if (rgbMatch[5]) {
			result.a = validOpacity(rgbMatch[6], rgbMatch[5]);
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
			// 考虑到转来转去可能和原始字符串不同，保留一份缩短后的 hsl 原始字符串
			result.a = validOpacity(hslMatch[6], hslMatch[5]);
			result.origin = `hsl(${validNum(CIRC, hue)},${validNum(Hundred, +hslMatch[3])}%,${validNum(Hundred, +hslMatch[4])}%,${shortenAlpha(digit, result.a)})`;
		}
		return result;
	}

	if (_color === 'transparent') {
		result.a = 0;
		return result;
	}

	result.valid = false;
	return result;
};
