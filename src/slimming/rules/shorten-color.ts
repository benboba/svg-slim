import { Declaration, StyleRules } from 'css';
import { both, has, pipe, toLower } from 'ramda';
import { parseColor } from '../color/parse';
import { rgb2hsl } from '../color/rgb2hsl';
import { FF, Hundred, OPACITY_DIGIT } from '../const';
import { regularAttr } from '../const/regular-attr';
import { shortenAlpha } from '../math/shorten-alpha';
import { parseStyle } from '../style/parse';
import { stringifyStyle } from '../style/stringify';
import { fillIn } from '../utils/fillin';
import { getShorter } from '../utils/get-shorter';
import { toHex } from '../utils/tohex';
import { traversalObj } from '../utils/traversal-obj';
import { isTag } from '../xml/is-tag';
import { traversalNode } from '../xml/traversal-node';

const operateHex = pipe(toHex, toLower, fillIn(2));

const alphaMap = {
	'100': 255,
	'99': 252,
	'98': 250,
	'97': 247,
	'96': 245,
	'95': 242,
	'94': 240,
	'93': 237,
	'92': 235,
	'91': 232,
	'90': 230,
	'89': 227,
	'88': 224,
	'87': 222,
	'86': 219,
	'85': 217,
	'84': 214,
	'83': 212,
	'82': 209,
	'81': 207,
	'80': 204,
	'79': 201,
	'78': 199,
	'77': 196,
	'76': 194,
	'75': 191,
	'74': 189,
	'73': 186,
	'72': 184,
	'71': 181,
	'70': 179,
	'69': 176,
	'68': 173,
	'67': 171,
	'66': 168,
	'65': 166,
	'64': 163,
	'63': 161,
	'62': 158,
	'61': 156,
	'60': 153,
	'59': 150,
	'58': 148,
	'57': 145,
	'56': 143,
	'55': 140,
	'54': 138,
	'53': 135,
	'52': 133,
	'51': 130,
	'50': 128,
	'49': 125,
	'48': 122,
	'47': 120,
	'46': 117,
	'45': 115,
	'44': 112,
	'43': 110,
	'42': 107,
	'41': 105,
	'40': 102,
	'39': 99,
	'38': 97,
	'37': 94,
	'36': 92,
	'35': 89,
	'34': 87,
	'33': 84,
	'32': 82,
	'31': 79,
	'30': 77,
	'29': 74,
	'28': 71,
	'27': 69,
	'26': 66,
	'25': 64,
	'24': 61,
	'23': 59,
	'22': 56,
	'21': 54,
	'20': 51,
	'19': 48,
	'18': 46,
	'17': 43,
	'16': 41,
	'15': 38,
	'14': 36,
	'13': 33,
	'12': 31,
	'11': 28,
	'10': 26,
	'9': 23,
	'8': 20,
	'7': 18,
	'6': 15,
	'5': 13,
	'4': 10,
	'3': 8,
	'2': 5,
	'1': 3,
	'0': 0,
};

const shortenMap = {
	'#f0ffff': 'azure',
	'#f5f5dc': 'beige',
	'#ffe4c4': 'bisque',
	'#a52a2a': 'brown',
	'#ff7f50': 'coral',
	'#ffd700': 'gold',
	'#808080': 'gray',
	'#008000': 'green',
	'#4b0082': 'indigo',
	'#fffff0': 'ivory',
	'#f0e68c': 'khaki',
	'#faf0e6': 'linen',
	'#800000': 'maroon',
	'#000080': 'navy',
	'#808000': 'olive',
	'#ffa500': 'orange',
	'#da70d6': 'orchid',
	'#cd853f': 'peru',
	'#ffc0cb': 'pink',
	'#dda0dd': 'plum',
	'#800080': 'purple',
	'#f00': 'red',
	'#fa8072': 'salmon',
	'#a0522d': 'sienna',
	'#c0c0c0': 'silver',
	'#fffafa': 'snow',
	'#d2b48c': 'tan',
	'#008080': 'teal',
	'#ff6347': 'tomato',
	'#ee82ee': 'violet',
	'#f5deb3': 'wheat',
};

const shortenReg = new RegExp(`(?:${Object.keys(shortenMap).join('|')})(?=[^0-9a-f]|$)`, 'gi');

const formatColor = (rgba: boolean, str: string, digit: number): string => {
	const color = parseColor(str, digit);
	let s = color.origin;

	if (color.valid) {
		if (color.a < 1) {
			if (rgba) {
				s = `#${operateHex(color.r)}${operateHex(color.g)}${operateHex(color.b)}${has(`${color.a * Hundred}`, alphaMap) ? operateHex(alphaMap[`${color.a * Hundred}` as keyof typeof alphaMap]) : operateHex(Math.round(color.a * FF))}`;
			} else {
				if (color.r === 0 && color.g === 0 && color.b === 0 && color.a === 0) {
					s = 'transparent';
				} else {
					const hslColor = rgb2hsl(color);
					const alpha = shortenAlpha(digit, color.a);
					const rgb = `rgb(${color.r},${color.g},${color.b},${alpha})`;
					const hsl = `hsl(${hslColor.h},${hslColor.s}%,${hslColor.l}%,${alpha})`;
					s = getShorter(hsl, rgb);
				}
			}
		} else {
			s = `#${operateHex(color.r)}${operateHex(color.g)}${operateHex(color.b)}`;
		}

		s = s.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3(?=[^0-9a-f]|$)/gi, '#$1$2$3');
		s = s.replace(shortenReg, $0 => `${shortenMap[$0 as keyof typeof shortenMap]}`);
		if (rgba) {
			s = s.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3([0-9a-f])\4(?=[^0-9a-f]|$)/gi, '#$1$2$3$4');
			s = s.replace(/^transparent$/i, '#0000');
		}
	}
	// 如果处理后结果不理想，还返回原始字符串
	if (s.length > color.origin.length) {
		return color.origin;
	}
	return s;
};

export const shortenColor = async (dom: IDomNode, {
	option: {
		rrggbbaa,
	},
	params: {
		opacityDigit,
	},
}: IRuleOption<{
	rrggbbaa: boolean;
}>): Promise<void> => new Promise(resolve => {
	const digit = Math.min(opacityDigit, OPACITY_DIGIT);
	traversalNode<ITagNode>(isTag, node => {
		node.attributes.forEach(attr => {
			if (regularAttr[attr.fullname].maybeColor) {
				attr.value = formatColor(rrggbbaa, attr.value, digit);
			} else if (attr.fullname === 'style') {
				const style = parseStyle(attr.value);
				style.forEach(s => {
					if (regularAttr[s.fullname].maybeColor) {
						s.value = formatColor(rrggbbaa, s.value, digit);
					}
				});
				attr.value = stringifyStyle(style);
			}
		});
	}, dom);

	if (dom.stylesheet) {
		// 缩短 style 标签内的颜色
		const parsedCss = dom.stylesheet.stylesheet as StyleRules;
		traversalObj(both(has('property'), has('value')), (cssRule: Declaration) => {
			if (regularAttr[cssRule.property as string].maybeColor) { // 可能为颜色的属性
				cssRule.value = formatColor(rrggbbaa, cssRule.value as string, digit);
			}
		}, parsedCss.rules);
	}
	resolve();
});
