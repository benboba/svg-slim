import { Declaration, StyleRules } from 'css';
import { both, has } from 'ramda';
import { IDomNode, ITagNode } from 'typings/node';
import { regularAttr } from '../const/regular-attr';
import { numberPattern } from '../const/syntax';
import { parseStyle } from '../style/parse';
import { stringifyStyle } from '../style/stringify';
import { traversalObj } from '../utils/traversal-obj';
import { isTag } from '../xml/is-tag';
import { traversalNode } from '../xml/traversal-node';

const pxReg = new RegExp(`(^|\\(|\\s|,|{|;|:)(${numberPattern})px(?=$|\\)|\\s|,|;|})`, 'gi');

export const rmPx = async (dom: IDomNode): Promise<void> => new Promise(resolve => {
	traversalNode<ITagNode>(isTag, node => {
		node.attributes.forEach(attr => {
			if (attr.fullname === 'style') {
				const style = parseStyle(attr.value);
				style.forEach(s => {
					if (regularAttr[s.fullname].maybeSizeNumber || regularAttr[s.fullname].maybeAccurateNumber) {
						pxReg.lastIndex = 0;
						// 移除 px ，同时移除 0 值的单位
						s.value = s.value.replace(pxReg, '$1$2').replace(/(^|\D)0[a-z]+/gi, '$10');
					}
				});
				attr.value = stringifyStyle(style);
			} else {
				if (regularAttr[attr.fullname].maybeSizeNumber || regularAttr[attr.fullname].maybeAccurateNumber) {
					pxReg.lastIndex = 0;
					// 移除 px ，同时移除 0 值的单位
					attr.value = attr.value.replace(pxReg, '$1$2').replace(/(^|\D)0[a-z]+/gi, '$10');
				}
			}
		});
	}, dom);

	if (dom.stylesheet) {
		// 缩短 style 标签内的数值
		const parsedCss = dom.stylesheet.stylesheet as StyleRules;
		traversalObj(both(has('property'), has('value')), (cssRule: Declaration) => {
			cssRule.value = (cssRule.value as string).replace(pxReg, '$1$2');
		}, parsedCss.rules);
	}
	resolve();
});
