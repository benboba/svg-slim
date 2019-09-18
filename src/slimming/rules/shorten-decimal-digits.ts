import { Declaration, StyleRules } from 'css';
import { both, curry, has } from 'ramda';
import { TConfigItem } from '../config/config';
import { animationAttributes } from '../const/definitions';
import { regularAttr } from '../const/regular-attr';
import { numberGlobal } from '../const/syntax';
import { IDomNode, ITagNode } from '../interface/node';
import { toFixed } from '../math/tofixed';
import { execStyle } from '../style/exec';
import { stringifyStyle } from '../style/stringify';
import { shortenNumberList } from '../utils/shorten-number-list';
import { toScientific } from '../utils/to-scientific';
import { traversalObj } from '../utils/traversal-obj';
import { isTag } from '../xml/is-tag';
import { traversalNode } from '../xml/traversal-node';

// 移除掉正、负号前面的逗号，移除掉0.前面的0，移除掉.1,.1或e1,.1这种case中间的逗号
const doShorten = curry((digit: number, val: string) => shortenNumberList(val.replace(numberGlobal, s => `${toScientific(toFixed(digit, parseFloat(s)))}`)));

export const shortenDecimalDigits = async (rule: TConfigItem[], dom: IDomNode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		const fuzzyDigit = doShorten(rule[1] as number);
		const accurateDigit = doShorten(rule[2] as number);

		if (dom.stylesheet) {
			// 缩短 style 标签内的数值
			const parsedCss = dom.stylesheet.stylesheet as StyleRules;
			traversalObj(both(has('property'), has('value')), (cssRule: Declaration) => {
				if (regularAttr[cssRule.property as string].maybeSizeNumber) { // 可以模糊处理的数字
					cssRule.value = fuzzyDigit(cssRule.value as string);
				} else if (regularAttr[cssRule.property as string].maybeAccurateNumber) { // 需要较精确的数字
					cssRule.value = accurateDigit(cssRule.value as string);
				}
			}, parsedCss.rules);
		}

		traversalNode<ITagNode>(isTag, node => {
			// 先取出来 attributeName 属性
			const attributeName = node.getAttribute('attributeName');

			// 缩短节点属性的数值
			node.attributes.forEach(attr => {
				if (regularAttr[attr.fullname].maybeSizeNumber) { // 可以模糊处理的数字
					attr.value = fuzzyDigit(attr.value);
				} else if (regularAttr[attr.fullname].maybeAccurateNumber) { // 需要较精确的数字
					attr.value = accurateDigit(attr.value);
				} else if (animationAttributes.indexOf(attr.fullname) !== -1) { // 动画处理的属性，需要根据 attributeName 属性判断
					if (attributeName) {
						if (regularAttr[attributeName].maybeSizeNumber) {
							attr.value = fuzzyDigit(attr.value);
						} else if (regularAttr[attributeName].maybeAccurateNumber) {
							attr.value = accurateDigit(attr.value);
						}
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
