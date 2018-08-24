import { parse as cssParse, stringify as cssStringify, Declaration} from 'css';
import { both, curry, has } from 'ramda';
import { regularAttr } from '../const/regular-attr';
import { toFixed } from '../math/tofixed';
import { execStyle } from '../style/exec';
import { shortenTag } from '../style/shorten-tag';
import { stringifyStyle } from '../style/stringify';
import { traversalObj } from '../utils/traversal-obj';
import { isTag } from '../xml/is-tag';
import { traversalNode } from '../xml/traversal-node';
import { animationAttributes } from '../const/definitions';
import { ConfigItem } from '../config/config';
import { INode } from '../../node';
import { numberRegGlobal } from '../const/tokens';

const doShorten = curry((digit: number, val: string) => val.replace(numberRegGlobal, s => `${toFixed(digit, parseFloat(s))}`.replace(/^0\./, '.')));

export const shortenDecimalDigits = (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		const fuzzyDigit = doShorten(rule[1] as number);
		const accurateDigit = doShorten(rule[2] as number);
		traversalNode(isTag, node => {
			if (node.nodeName === 'style') {

				// 缩短 style 标签内的数值
				const parsedCss = cssParse(node.childNodes[0].textContent, { silent: true });
				if (parsedCss) {
					traversalObj(both(has('property'), has('value')), (cssRule: Declaration) => {
						if (regularAttr[cssRule.property].maybeSizeNumber) { // 可以模糊处理的数字
							cssRule.value = fuzzyDigit(cssRule.value);
						} else if (regularAttr[cssRule.property].maybeAccurateNumber) { // 需要较精确的数字
							cssRule.value = accurateDigit(cssRule.value);
						}
					}, parsedCss.stylesheet.rules);
					node.childNodes[0].textContent = shortenTag(cssStringify(parsedCss, { compress: true }));
				}

			}

			// 先取出来 attributeName 属性
			const attributeName = node.getAttribute('attributeName');

			// 缩短节点属性的数值
			node.attributes.forEach(attr => {
				if (regularAttr[attr.fullname].maybeSizeNumber) { // 可以模糊处理的数字
					attr.value = fuzzyDigit(attr.value);
				} else if (regularAttr[attr.fullname].maybeAccurateNumber) { // 需要较精确的数字
					attr.value = accurateDigit(attr.value);
				} else if (animationAttributes.indexOf(attr.fullname) !== -1) { // 动画处理的属性，需要根据 attributeName 属性判断
					if (regularAttr[attributeName].maybeSizeNumber) {
						attr.value = fuzzyDigit(attr.value);
					} else if (regularAttr[attributeName].maybeAccurateNumber) {
						attr.value = accurateDigit(attr.value);
					}
				} else if (attr.fullname === 'style') { // css 样式处理，和属性类似
					const style = execStyle(attr.value);
					style.forEach(s => {
						if (regularAttr[s.fullname].maybeSizeNumber) {
							s.value = fuzzyDigit(s.value);
						} else if (regularAttr[s.fullname].maybeAccurateNumber) {
							s.value = accurateDigit(s.value);
						}
					});
					attr.value = stringifyStyle(style);
				}
			});
		}, dom);
	}
	resolve();
});