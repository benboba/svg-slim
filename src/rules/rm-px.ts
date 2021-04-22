import { Declaration, StyleRules } from 'css';
import { both, has } from 'ramda';
import { ITagNode, NodeType } from 'svg-vdom';
import { IDom } from '../../typings/node';
import { needUnitInStyle } from '../const/definitions';
import { regularAttr } from '../const/regular-attr';
import { numberPattern } from '../const/syntax';
import { parseStyle } from '../style/parse';
import { stringifyStyle } from '../style/stringify';
import { traversalObj } from '../utils/traversal-obj';

const pxReg = new RegExp(`(?<=^|\\(|\\s|,|{|;|:)(${numberPattern})px(?=$|\\)|\\s|,|;|})`, 'gi');

export const rmPx = async (dom: IDom): Promise<void> => new Promise(resolve => {
	const tags = dom.querySelectorAll(NodeType.Tag) as ITagNode[];
	tags.forEach(node => {
		node.attributes.forEach(attr => {
			if (attr.fullname === 'style') {
				const styleList = parseStyle(attr.value);
				styleList.forEach(s => {
					if (regularAttr[s.fullname].maybeSizeNumber || regularAttr[s.fullname].maybeAccurateNumber) {
						// 移除 px ，同时移除 0 值的单位
						pxReg.lastIndex = 0;
						// 特殊：部分 key 如果在 style 属性中，px 单位不能被移除
						// https://github.com/benboba/svg-slim/issues/31
						if (!needUnitInStyle.includes(s.fullname)) {
							s.value = s.value.replace(pxReg, '$1');
						}
						s.value = s.value.replace(/(?<=^|\D)0[a-z]+?(?=$|\)|\s|,|;|})/gi, '0');
					}
				});
				attr.value = stringifyStyle(styleList);
			} else {
				if (regularAttr[attr.fullname].maybeSizeNumber || regularAttr[attr.fullname].maybeAccurateNumber) {
					pxReg.lastIndex = 0;
					// 移除 px ，同时移除 0 值的单位
					attr.value = attr.value.replace(pxReg, '$1').replace(/(?<=^|\D)0[a-z]+?(?=$|\)|\s|,|;|})/gi, '0');
				}
			}
		});
	});

	if (dom.stylesheet) {
		// 缩短 style 标签内的数值
		const parsedCss = dom.stylesheet.stylesheet as StyleRules;
		traversalObj(both(has('property'), has('value')), (cssRule: Declaration) => {
			if (!needUnitInStyle.includes(cssRule.property as string)) {
				cssRule.value = (cssRule.value as string).replace(pxReg, '$1');
			}
			cssRule.value = (cssRule.value as string).replace(/(?<=^|\D)0[a-z]+?(?=$|\)|\s|,|;|})/gi, '0');
		}, parsedCss.rules);
	}
	resolve();
});
