import { parse as cssParse, stringify as cssStringify } from 'css';
import { has, propEq } from 'ramda';
import { INode } from '../../node/index';
import { regularAttr } from '../const/regular-attr';
import { shortenTag } from '../style/shorten-tag';
import { mixWhiteSpace } from '../utils/mix-white-space';
import { traversalObj } from '../utils/traversal-obj';
import { legalValue } from '../validate/legal-value';
import { getBySelector } from '../xml/get-by-selector';
import { traversalNode } from '../xml/traversal-node';

export const shortenStyleTag = (rule, dom) => new Promise((resolve, reject) => {
	if (rule[0]){
		traversalNode(propEq('nodeName', 'style'), (node: INode) => {
			const cssContent = node.childNodes[0];
			const parsedCss = cssParse(cssContent.textContent);

			// 遍历 style 解析对象，取得包含 css 定义的值
			traversalObj(has('declarations'), (cssRule, parents) => {
				const declared = {};
				for (let i = cssRule.declarations.length; i--; ) {
					const ruleItem = cssRule.declarations[i];
					const property = ruleItem.property;
					/*
					 * 1、排重
					 * 2、验证属性有效性
					 * 3、验证值合法性
					 */
					if (!declared[property] && regularAttr[property].couldBeStyle && legalValue(regularAttr[property], ruleItem.value)) {
						declared[property] = true;
					} else {
						cssRule.declarations.splice(i, 1);
					}
				}
				if (!cssRule.declarations.length) {
					const plen = parents.length;
					const plist = parents[plen - 1];
					plist.splice(plist.indexOf(cssRule), 1);
					if (cssRule.type === 'keyframe' && !plist.length) {
						const rules = parents[plen - 3];
						rules.splice(rules.indexOf(parents[plen - 2]), 1);
					}
				}
			}, parsedCss.stylesheet.rules);

			// 深度优化
			if (rule[1]) {
				const selectorUnique = {};
				const declareUnique = {};
				for (let i = 0, l = parsedCss.stylesheet.rules.length; i < l; i++) {
					const styleRule = parsedCss.stylesheet.rules[i];
					// 只针对规则类
					if (styleRule.type === 'rule') {
						// 移除无效的选择器
						for (let si = styleRule.selectors.length; si--; ) {
							if (!getBySelector(dom, styleRule.selectors[si]).length) {
								styleRule.selectors.splice(si, 1);
							}
						}
						if (!styleRule.selectors.length) {
							parsedCss.stylesheet.rules.splice(i, 1);
							i--;
							l--;
							continue;
						}

						// 合并相同选择器
						styleRule.selectors.sort((a, b) => a < b ? -1 : 1);
						styleRule.selectors = styleRule.selectors.map(s => mixWhiteSpace(s.trim()));
						const selectorKey = styleRule.selectors.join(',');
						if (selectorUnique[selectorKey]) {
							const declarations = selectorUnique[selectorKey].declarations.concat(styleRule.declarations);
							// 合并之后依然要排重
							const declared = {};
							for (let j = declarations.length; j--; ) {
								if (declared[declarations[j].property]) {
									declarations.splice(j, 1);
								} else {
									declared[declarations[j].property] = true;
								}
							}
							selectorUnique[selectorKey].declarations = declarations;
							parsedCss.stylesheet.rules.splice(i, 1);
							i--;
							l--;
							continue;
						} else {
							selectorUnique[selectorKey] = styleRule;
						}

						// 合并相同规则
						styleRule.declarations.sort((a, b) => a.property < b.property ? -1 : 1);
						const declareKey = styleRule.declarations.map(d => `${d.property}:${d.value}`).join(';');
						if (declareUnique[declareKey]) {
							const selectors = declareUnique[declareKey].selectors.concat(styleRule.selectors);
							const selected = {};
							for (let j = selectors.length; j--; ) {
								if (selected[selectors[j]]) {
									selectors.splice(j, 1);
								} else {
									selected[selectors[j]] = true;
								}
							}
							declareUnique[declareKey].selectors = selectors;
							parsedCss.stylesheet.rules.splice(i, 1);
							i--;
							l--;
							continue;
						} else {
							declareUnique[declareKey] = styleRule;
						}
					}
				}
			}

			cssContent.textContent = shortenTag(cssStringify(parsedCss, { compress: true }));

		}, dom);
	}
	resolve();
});