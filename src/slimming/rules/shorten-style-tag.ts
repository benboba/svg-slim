import { AtRule, Declaration, KeyFrame, parse as cssParse, Rule, stringify as cssStringify, StyleRules } from 'css';
import { has, propEq } from 'ramda';
import { ConfigItem } from '../config/config';
import { regularAttr } from '../const/regular-attr';
import { IUnique } from '../interface/unique';
import { shortenTag } from '../style/shorten-tag';
import { mixWhiteSpace } from '../utils/mix-white-space';
import { traversalObj } from '../utils/traversal-obj';
import { legalValue } from '../validate/legal-value';
import { getBySelector } from '../xml/get-by-selector';
import { traversalNode } from '../xml/traversal-node';
import { execSelector } from '../style/exec-selector';
import { ITagNode } from '../interface/node';
import { INode } from '../../node';

interface ICSSUnique {
	[propName: string]: Rule;
}

export const shortenStyleTag = async (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		traversalNode<ITagNode>(propEq('nodeName', 'style'), node => {
			const cssContent = node.childNodes[0];
			const parsedCss = cssParse(cssContent.textContent as string);
			const cssRules = (parsedCss.stylesheet as StyleRules).rules;

			// 遍历 style 解析对象，取得包含 css 定义的值
			traversalObj(has('declarations'), (cssRule: Rule, parents: AtRule[]) => {
				const declared: IUnique = {};
				const declarations = cssRule.declarations as Declaration[];
				for (let i = declarations.length; i--; ) {
					const ruleItem = declarations[i];
					const property = ruleItem.property as string;
					/*
					 * 1、排重
					 * 2、验证属性有效性
					 * 3、验证值合法性
					 */
					if (!declared[property] && regularAttr[property].couldBeStyle && legalValue(regularAttr[property], {
						fullname: property,
						name: property,
						value: ruleItem.value as string
					})) {
						declared[property] = true;
					} else {
						declarations.splice(i, 1);
					}
				}
				if (!declarations.length) {
					const plen = parents.length;
					const plist = parents[plen - 1] as Rule[];
					plist.splice(plist.indexOf(cssRule), 1);
					if (cssRule.type === 'keyframe' && !plist.length) {
						const rules = parents[plen - 3] as KeyFrame[];
						rules.splice(rules.indexOf(parents[plen - 2]), 1);
					}
				}
			}, cssRules);

			// 深度优化
			if (rule[1]) {
				const selectorUnique: ICSSUnique = {};
				const declareUnique: ICSSUnique = {};
				for (let i = 0, l = cssRules.length; i < l; i++) {
					const styleRule = cssRules[i] as Rule;
					// 只针对规则类
					if (styleRule.type === 'rule') {
						const theSelectors = styleRule.selectors as string[];
						// 移除无效的选择器
						for (let si = theSelectors.length; si--; ) {
							if (!getBySelector(dom, execSelector(theSelectors[si])).length) {
								theSelectors.splice(si, 1);
							}
						}
						if (!theSelectors.length) {
							cssRules.splice(i, 1);
							i--;
							l--;
							continue;
						}

						// 合并相同选择器
						theSelectors.sort((a, b) => a < b ? -1 : 1);
						styleRule.selectors = theSelectors.map(s => mixWhiteSpace(s.trim()));
						const selectorKey = styleRule.selectors.join(',');
						if (selectorUnique.hasOwnProperty(selectorKey)) {
							const declarations = (selectorUnique[selectorKey].declarations as Declaration[]).concat(styleRule.declarations as Declaration[]);
							// 合并之后依然要排重
							const declared: IUnique = {};
							for (let j = declarations.length; j--; ) {
								if (declared[declarations[j].property as string]) {
									declarations.splice(j, 1);
								} else {
									declared[declarations[j].property as string] = true;
								}
							}
							selectorUnique[selectorKey].declarations = declarations;
							cssRules.splice(i, 1);
							i--;
							l--;
							continue;
						} else {
							selectorUnique[selectorKey] = styleRule;
						}

						// 合并相同规则
						(styleRule.declarations as Declaration[]).sort((a: Declaration, b: Declaration) => (a.property as string) < (b.property as string) ? -1 : 1);
						const declareKey = (styleRule.declarations as Declaration[]).map((d: Declaration) => `${d.property}:${d.value}`).join(';');
						if (declareUnique.hasOwnProperty(declareKey)) {
							const selectors: string[] = (declareUnique[declareKey].selectors as string[]).concat(styleRule.selectors);
							const selected: IUnique = {};
							for (let j = selectors.length; j--; ) {
								if (selected[selectors[j]]) {
									selectors.splice(j, 1);
								} else {
									selected[selectors[j]] = true;
								}
							}
							declareUnique[declareKey].selectors = selectors;
							cssRules.splice(i, 1);
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
