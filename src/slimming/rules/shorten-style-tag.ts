import { AtRule, Declaration, KeyFrame, parse as cssParse, Rule, stringify as cssStringify } from 'css';
import { has, propEq } from 'ramda';
import { INode } from '../../node/index';
import { ConfigItem } from '../config/config';
import { regularAttr } from '../const/regular-attr';
import { IUnique } from '../interface/unique';
import { shortenTag } from '../style/shorten-tag';
import { mixWhiteSpace } from '../utils/mix-white-space';
import { traversalObj } from '../utils/traversal-obj';
import { legalValue } from '../validate/legal-value';
import { getBySelector } from '../xml/get-by-selector';
import { traversalNode } from '../xml/traversal-node';

interface ICSSUnique {
	[propName: string]: Rule;
}

export const shortenStyleTag = (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]){
		traversalNode(propEq('nodeName', 'style'), (node: INode) => {
			const cssContent = node.childNodes[0];
			const parsedCss = cssParse(cssContent.textContent);

			// 遍历 style 解析对象，取得包含 css 定义的值
			traversalObj(has('declarations'), (cssRule: Rule, parents: AtRule[]) => {
				const declared: IUnique = {};
				for (let i = cssRule.declarations.length; i--; ) {
					const ruleItem = cssRule.declarations[i] as Declaration;
					const property = ruleItem.property;
					/*
					 * 1、排重
					 * 2、验证属性有效性
					 * 3、验证值合法性
					 */
					if (!declared[property] && regularAttr[property].couldBeStyle && legalValue(regularAttr[property], {
						fullname: property,
						name: property,
						value: ruleItem.value
					})) {
						declared[property] = true;
					} else {
						cssRule.declarations.splice(i, 1);
					}
				}
				if (!cssRule.declarations.length) {
					const plen = parents.length;
					const plist = parents[plen - 1] as Rule[];
					plist.splice(plist.indexOf(cssRule), 1);
					if (cssRule.type === 'keyframe' && !plist.length) {
						const rules = parents[plen - 3] as KeyFrame[];
						rules.splice(rules.indexOf(parents[plen - 2]), 1);
					}
				}
			}, parsedCss.stylesheet.rules);

			// 深度优化
			if (rule[1]) {
				const selectorUnique: ICSSUnique = {};
				const declareUnique: ICSSUnique = {};
				for (let i = 0, l = parsedCss.stylesheet.rules.length; i < l; i++) {
					const styleRule = parsedCss.stylesheet.rules[i] as Rule;
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
							const declarations = selectorUnique[selectorKey].declarations.concat(styleRule.declarations) as Declaration[];
							// 合并之后依然要排重
							const declared: IUnique = {};
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
						styleRule.declarations.sort((a: Declaration, b: Declaration) => a.property < b.property ? -1 : 1);
						const declareKey = styleRule.declarations.map((d: Declaration) => `${d.property}:${d.value}`).join(';');
						if (declareUnique[declareKey]) {
							const selectors: string[] = declareUnique[declareKey].selectors.concat(styleRule.selectors);
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