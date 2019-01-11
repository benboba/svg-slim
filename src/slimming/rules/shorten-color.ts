import { Declaration, parse as cssParse, stringify as cssStringify, StyleRules } from 'css';
import { both, has, pipe, toLower } from 'ramda';
import { INode } from '../../node';
import { exec } from '../color/exec';
import { ConfigItem } from '../config/config';
import { regularAttr } from '../const/regular-attr';
import { numberPattern } from '../const/syntax';
import { ITagNode } from '../interface/node';
import { toFixed } from '../math/tofixed';
import { execStyle } from '../style/exec';
import { shortenTag } from '../style/shorten-tag';
import { stringifyStyle } from '../style/stringify';
import { fillIn } from '../utils/fillin';
import { toHex } from '../utils/tohex';
import { traversalObj } from '../utils/traversal-obj';
import { isTag } from '../xml/is-tag';
import { traversalNode } from '../xml/traversal-node';

const operateHex = pipe(toHex, toLower, fillIn(2));

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
const FF = 255;

const formatColor = (rgba: boolean, digit: number, str: string): string => {
	const color = exec(str);
	let s = color.origin;

	if (color.valid) {
		if (color.a < 1) {
			// tslint:disable:prefer-conditional-expression
			if (rgba) {
				s = `#${operateHex(color.r)}${operateHex(color.g)}${operateHex(color.b)}${operateHex(color.a * FF)}`;
			} else {
				s = `rgba(${color.r},${color.g},${color.a},${`${toFixed(digit, color.a)}`.replace(/^0\./, '.')})`;
			}
		} else {
			s = `#${operateHex(color.r)}${operateHex(color.g)}${operateHex(color.b)}`;
		}
	}

	s = s.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3(?=[^0-9a-f]|$)/gi, '#$1$2$3');
	s = s.replace(shortenReg, $0 => `${shortenMap[$0 as keyof typeof shortenMap]}`);
	if (rgba) {
		s = s.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3([0-9a-f])\4(?=[^0-9a-f]|$)/gi, '#$1$2$3$4');
		s = s.replace(/transparent/gi, '#0000');
	}
	return s;
};

export const shortenColor = async (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		traversalNode<ITagNode>(isTag, node => {
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
				traversalObj(both(has('property'), has('value')), (cssRule: Declaration) => {
					if (regularAttr[cssRule.property as string].maybeColor) { // 可以模糊处理的数字
						cssRule.value = formatColor(rule[1] as boolean, rule[2] as number, cssRule.value as string);
					}
				}, (parsedCss.stylesheet as StyleRules).rules);
				node.childNodes[0].textContent = shortenTag(cssStringify(parsedCss, { compress: true }));

			}
		}, dom);
	}
	resolve();
});
