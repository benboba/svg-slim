import { Declaration, StyleRules } from 'css';
import { both, curry, has } from 'ramda';
import { IRuleOption } from 'typings';
import { IDomNode, ITagNode } from 'typings/node';
import { animationAttrElements, animationAttributes } from '../const/definitions';
import { regularAttr } from '../const/regular-attr';
import { numberGlobal } from '../const/syntax';
import { parseAlpha } from '../math/parse-alpha';
import { shortenAlpha } from '../math/shorten-alpha';
import { toFixed } from '../math/to-fixed';
import { parseStyle } from '../style/parse';
import { stringifyStyle } from '../style/stringify';
import { shortenNumber } from '../utils/shorten-number';
import { shortenNumberList } from '../utils/shorten-number-list';
import { traversalObj } from '../utils/traversal-obj';
import { isTag } from '../xml/is-tag';
import { traversalNode } from '../xml/traversal-node';

// 移除掉正、负号前面的逗号，移除掉0.前面的0，移除掉.1,.1或e1,.1这种case中间的逗号
const doShorten = curry((digit: number, val: string) => shortenNumberList(val.replace(numberGlobal, s => `${shortenNumber(toFixed(digit, parseFloat(s)))}`)));

export const shortenDecimalDigits = async (dom: IDomNode, {
	params: {
		sizeDigit,
		angelDigit,
	}
}: IRuleOption): Promise<void> => new Promise(resolve => {
	const fuzzyDigit = doShorten(sizeDigit);
	const accurateDigit = doShorten(angelDigit);

	const shortenValue = (key: string, value: string) => {
		const define = regularAttr[key];
		if (define.maybeAlpha) { // alpha 值采用特殊处理逻辑
			const alpha = parseAlpha(value);
			if (typeof alpha === 'number') {
				return shortenAlpha(angelDigit, alpha);
			}
		} else if (define.maybeSizeNumber) { // 可以模糊处理的数字
			return fuzzyDigit(value);
		} else if (define.maybeAccurateNumber) { // 需要较精确的数字
			return accurateDigit(value);
		}
		return value;
	};

	if (dom.stylesheet) {
		// 缩短 style 标签内的数值
		const parsedCss = dom.stylesheet.stylesheet as StyleRules;
		traversalObj(both(has('property'), has('value')), (cssRule: Declaration) => {
			cssRule.value = shortenValue(cssRule.property as string, cssRule.value as string);
		}, parsedCss.rules);
	}

	traversalNode<ITagNode>(isTag, node => {
		// 先取出来 attributeName 属性
		const attributeName = node.getAttribute('attributeName');

		// 缩短节点属性的数值
		node.attributes.forEach(attr => {
			numberGlobal.lastIndex = 0;
			if (animationAttributes.includes(attr.fullname) && animationAttrElements.includes(node.nodeName)) { // 动画处理的属性，需要根据 attributeName 属性判断
				if (attributeName) {
					attr.value = shortenValue(attributeName, attr.value);
				}
			} else if (attr.fullname === 'style') { // css 样式处理，和属性类似
				const style = parseStyle(attr.value);
				style.forEach(s => {
					numberGlobal.lastIndex = 0;
					s.value = shortenValue(s.fullname, s.value);
				});
				attr.value = stringifyStyle(style);
			} else {
				attr.value = shortenValue(attr.fullname, attr.value);
			}
		});
	}, dom);
	resolve();
});
