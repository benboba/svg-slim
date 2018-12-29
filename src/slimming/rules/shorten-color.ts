import { parse as cssParse, stringify as cssStringify, Declaration, StyleRules } from 'css';
import { both, has, pipe, toLower } from 'ramda';
import { regularAttr } from '../const/regular-attr';
import { toFixed } from '../math/tofixed';
import { shortenFunc } from '../utils/shorten-func';
import { execStyle } from '../style/exec';
import { shortenTag } from '../style/shorten-tag';
import { stringifyStyle } from '../style/stringify';
import { fillIn } from '../utils/fillin';
import { toHex } from '../utils/tohex';
import { traversalObj } from '../utils/traversal-obj';
import { isTag } from '../xml/is-tag';
import { traversalNode } from '../xml/traversal-node';
import { ConfigItem } from '../config/config';
import { INode } from '../../node';
import { numberPattern } from '../const/syntax';

const operateHex = pipe(toHex, toLower, fillIn(2));

const shortenMap1 = {
    'aliceblue': '#f0f8ff',
    'antiquewhite': 'faebd7',
    'aquamarine': '#7fffd4',
	'black': '#000',
	'blanchedalmond': '#ffebcd',
	'blueviolet': '#8a2be2',
	'burlywood': '#deb887',
	'burntsienna': '#ea7e5d',
	'cadetblue': '#5f9ea0',
	'chartreuse': '#7fff00',
	'chocolate': '#d2691e',
	'cornflowerblue': '#6495ed',
	'cornsilk': '#fff8dc',
	'darkblue': '#00008b',
	'darkcyan': '#008b8b',
	'darkgoldenrod': '#b8860b',
	'darkgray': '#a9a9a9',
	'darkgreen': '#006400',
	'darkgrey': '#a9a9a9',
	'darkkhaki': '#bdb76b',
	'darkmagenta': '#8b008b',
	'darkolivegreen': '#556b2f',
	'darkorange': '#ff8c00',
	'darkorchid': '#9932cc',
	'darksalmon': '#e9967a',
	'darkseagreen': '#8fbc8f',
	'darkslateblue': '#483d8b',
	'darkslategray': '#2f4f4f',
	'darkslategrey': '#2f4f4f',
	'darkturquoise': '#00ced1',
	'darkviolet': '#9400d3',
	'deeppink': '#ff1493',
	'deepskyblue': '#00bfff',
	'dodgerblue': '#1e90ff',
	'firebrick': '#b22222',
	'floralwhite': '#fffaf0',
	'forestgreen': '#228b22',
	'gainsboro': '#dcdcdc',
	'ghostwhite': '#f8f8ff',
	'goldenrod': '#daa520',
	'greenyellow': '#adff2f',
	'honeydew': '#f0fff0',
	'indianred': '#cd5c5c',
	'lavender': '#e6e6fa',
	'lavenderblush': '#fff0f5',
	'lawngreen': '#7cfc00',
	'lemonchiffon': '#fffacd',
	'lightblue': '#add8e6',
	'lightcoral': '#f08080',
	'lightcyan': '#e0ffff',
	'lightgoldenrodyellow': '#fafad2',
	'lightgray': '#d3d3d3',
	'lightgreen': '#90ee90',
	'lightgrey': '#d3d3d3',
	'lightpink': '#ffb6c1',
	'lightsalmon': '#ffa07a',
	'lightseagreen': '#20b2aa',
	'lightskyblue': '#87cefa',
	'lightslategray': '#789',
	'lightslategrey': '#789',
	'lightsteelblue': '#b0c4de',
	'lightyellow': '#ffffe0',
	'limegreen': '#32cd32',
	'mediumaquamarine': '#66cdaa',
	'mediumblue': '#0000cd',
	'mediumorchid': '#ba55d3',
	'mediumpurple': '#9370db',
	'mediumseagreen': '#3cb371',
	'mediumslateblue': '#7b68ee',
	'mediumspringgreen': '#00fa9a',
	'mediumturquoise': '#48d1cc',
	'mediumvioletred': '#c71585',
	'midnightblue': '#191970',
	'mintcream': '#f5fffa',
	'mistyrose': '#ffe4e1',
	'moccasin': '#ffe4b5',
	'navajowhite': '#ffdead',
	'olivedrab': '#6b8e23',
	'orangered': '#ff4500',
	'palegoldenrod': '#eee8aa',
	'palegreen': '#98fb98',
	'paleturquoise': '#afeeee',
	'palevioletred': '#db7093',
	'papayawhip': '#ffefd5',
	'peachpuff': '#ffdab9',
	'powderblue': '#b0e0e6',
	'rebeccapurple': '#639',
	'rosybrown': '#bc8f8f',
	'royalblue': '#4169e1',
	'saddlebrown': '#8b4513',
	'sandybrown': '#f4a460',
	'seagreen': '#2e8b57',
	'seashell': '#fff5ee',
	'slateblue': '#6a5acd',
	'slategray': '#708090',
	'slategrey': '#708090',
	'springgreen': '#00ff7f',
	'steelblue': '#4682b4',
	'turquoise': '#40e0d0',
	'white': '#fff',
	'whitesmoke': '#f5f5f5',
	'yellow': '#ff0',
	'yellowgreen': '#9acd32',
};
const shortenReg1 = new RegExp(`(^|[^a-z])(${Object.keys(shortenMap1).join('|')})(?=[^a-z]|$)`, 'gi');

const shortenMap2 = {
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
const shortenReg2 = new RegExp(`(?:${Object.keys(shortenMap2).join('|')})(?=[^0-9a-f]|$)`, 'gi');

const Hundred = 100;
const FF = 255;
const Circ = 360;
const Circ6 = 60;
const half = 0.5;

const validPercent = (max: number, n: number) => Math.round(Math.max(Math.min(Hundred, n), 0) * max / Hundred);
const validNum = (max: number, n: number) => Math.max(Math.min(max, Math.round(n)), 0);
const valid = (p: string, max: number, n: string) => p ? validPercent(max, +n) : validNum(max, +n);
const validOpacity = (digit: number, p: string, n: string) => toFixed(digit, Math.max(Math.min(1, p ? +n / Hundred : +n), 0));

function hsl2rgb(h: number, s: number, l: number): number[] {
	let _R: number, G: number, B: number, X: number, C: number;
	let _h = (h % Circ) / Circ6;
	C = 2 * s * (l < half ? l : 1 - l);
	X = C * (1 - Math.abs(_h % 2 - 1));
	_R = G = B = l - C / 2;

	_h = ~~_h;
	_R += [C, X, 0, 0, X, C][_h];
	G += [X, C, C, X, 0, 0][_h];
	B += [0, 0, X, C, C, X][_h];
	return [validNum(FF, _R * FF), validNum(FF, G * FF), validNum(FF, B * FF)];
}

const colorFuncReg = new RegExp(`((?:rgb|hsl)a?)\\((${numberPattern})(%?),(${numberPattern})(%?),(${numberPattern})(%?)(?:,(${numberPattern})(%?))?\\)`, 'gi');

const formatColor = (rgba: boolean, digit: number, str: string) => {
	let s = shortenFunc(str).replace(colorFuncReg, (match, func: string, n1: string, p1: string, n2: string, p2: string, n3: string, p3: string, n4: string, p4: string) => {
		switch (func) {
			case 'rgb':
				if (p1 === p2 && p1 === p3) {
					return `#${operateHex(valid(p1, FF, n1))}${operateHex(valid(p1, FF, n2))}${operateHex(valid(p1, FF, n3))}`;
				} else {
					return '';
				}
			case 'rgba':
				if (p1 === p2 && p1 === p3) {
					if (rgba) {
						return `#${operateHex(valid(p1, FF, n1))}${operateHex(valid(p1, FF, n2))}${operateHex(valid(p1, FF, n3))}${operateHex(validOpacity(digit, p4, n4))}`;
					} else {
						return `rgba(${valid(p1, FF, n1)},${valid(p1, FF, n2)},${valid(p1, FF, n3)},${`${validOpacity(digit, p4, n4)}`.replace(/^0\./, '.')})`;
					}
				} else {
					return '';
				}
			case 'hsl':
				if (p1 || !p2 || !p3) {
					return '';
				} else {
					const [r, g, b] = hsl2rgb(+n1, +n2 / Hundred, +n3 / Hundred);
					return `#${operateHex(r)}${operateHex(g)}${operateHex(b)}`;
				}
			case 'hsla':
				if (p1 || !p2 || !p3) {
					return '';
				} else {
					const [r, g, b] = hsl2rgb(+n1, +n2 / Hundred, +n3 / Hundred);
					if (rgba) {
						return `#${operateHex(r)}${operateHex(g)}${operateHex(b)}${operateHex(validOpacity(digit, p4, n4))}`;
					} else {
						return `rgba(${r},${g},${b},${`${validOpacity(digit, p4, n4)}`.replace(/^0\./, '.')})`;
					}
				}
			default:
				return match;
		}
	});

	s = s.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3(?=[^0-9a-f]|$)/gi, '#$1$2$3');
	s = s.replace(shortenReg1, ($0, $1, $2) => `${$1}${shortenMap1[$2 as keyof typeof shortenMap1]}`).replace(shortenReg2, $0 => `${shortenMap2[$0 as keyof typeof shortenMap2]}`);
	if (rgba) {
		s = s.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3([0-9a-f])\4(?=[^0-9a-f]|$)/gi, '#$1$2$3$4');
		s = s.replace(/transparent/gi, '#0000');
	}
	return s;
};

export const shortenColor = (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		traversalNode(isTag, node => {
			node.attributes.forEach(attr => {
				if (regularAttr[attr.fullname].maybeColor) {
					attr.value = formatColor(rule[1] as boolean, rule[2] as number, attr.value);
				} else if (attr.fullname === 'style') {
					const style = execStyle(attr.value);
					style.forEach(s => {
						if (regularAttr[s.fullname].maybeColor) {
							s.value = formatColor(rule[1] as boolean, rule[2] as number, s.value);
						}
					});
					attr.value = stringifyStyle(style);
				}
			});

			if (node.nodeName === 'style') {

				// 缩短 style 标签内的数值
				const parsedCss = cssParse(node.childNodes[0].textContent as string, { silent: true });
				if (parsedCss) {
					traversalObj(both(has('property'), has('value')), (cssRule: Declaration) => {
						if (regularAttr[cssRule.property as string].maybeColor) { // 可以模糊处理的数字
							cssRule.value = formatColor(rule[1] as boolean, rule[2] as number, cssRule.value as string);
						}
					}, (parsedCss.stylesheet as StyleRules).rules);
					node.childNodes[0].textContent = shortenTag(cssStringify(parsedCss, { compress: true }));
				}

			}
		}, dom);
	}
	resolve();
});