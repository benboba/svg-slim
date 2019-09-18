import { Declaration, KeyFrame, KeyFrames, Media, Node, Rule, StyleRules } from 'css';
import { has } from 'ramda';
import { TConfigItem } from '../config/config';
import { regularAttr } from '../const/regular-attr';
import { IDomNode } from '../interface/node';
import { IUnique } from '../interface/unique';
import { checkApply } from '../style/check-apply';
import { execSelector } from '../style/exec-selector';
import { mixWhiteSpace } from '../utils/mix-white-space';
import { traversalObj } from '../utils/traversal-obj';
import { legalValue } from '../validate/legal-value';
import { getBySelector } from '../xml/get-by-selector';

interface ICSSUnique {
	[propName: string]: Rule;
}

const rmCSSNode = (cssNode: Node, parents: Array<Node | Node[]>) => {
	const plen = parents.length;
	const plist = parents[plen - 1] as Rule[];
	plist.splice(plist.indexOf(cssNode), 1);
};

export const shortenStyleTag = async (rule: TConfigItem[], dom: IDomNode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0] && dom.stylesheet) {
		const cssRules: StyleRules = dom.stylesheet.stylesheet as StyleRules;

		// 遍历 style 解析对象，取得包含 css 定义的值
		traversalObj<Node>(has('type'), (cssNode, parents) => {
			switch (cssNode.type) {
				case 'rule':
				case 'keyframe':
				case 'font-face':
				case 'page':
					const cssRule = cssNode as Rule | KeyFrame;
					if (!cssRule.declarations) {
						rmCSSNode(cssRule, parents);
						return;
					}
					const declared: IUnique = {};
					for (let i = cssRule.declarations.length; i--;) {
						const ruleItem = cssRule.declarations[i] as Declaration;
						// 排重
						if (!declared[ruleItem.property as string]) {
							declared[ruleItem.property as string] = true;
						} else {
							cssRule.declarations.splice(i, 1);
						}
					}
					if (!cssRule.declarations.length) {
						rmCSSNode(cssRule, parents);
					}
					break;
				case 'declaration':
					const declaration = cssNode as Declaration;
					// 1、验证属性有效性  2、验证值合法性
					if (!declaration.property || !declaration.value) {
						rmCSSNode(cssNode, parents);
					} else {
						if (!regularAttr[declaration.property].couldBeStyle || !legalValue(regularAttr[declaration.property], {
							fullname: declaration.property,
							name: declaration.property,
							value: declaration.value,
						})) {
							rmCSSNode(cssNode, parents);
						}
					}
					break;
				case 'keyframes':
					const keyframes = cssNode as KeyFrames;
					if (!keyframes.keyframes || !keyframes.keyframes.length) {
						rmCSSNode(cssNode, parents);
					}
					break;
				case 'media':
				case 'host':
				case 'supports':
				case 'document':
					const ruleParent = cssNode as Media;
					if (!ruleParent.rules || !ruleParent.rules.length) {
						rmCSSNode(cssNode, parents);
					}
					break;
				case 'comment':
					rmCSSNode(cssNode, parents);
					break;
				default:
					break;
			}
		}, cssRules.rules, true);

		// 深度优化
		if (rule[1]) {
			const selectorUnique: ICSSUnique = {};
			const declareUnique: ICSSUnique = {};
			for (let i = 0, l = cssRules.rules.length; i < l; i++) {
				const styleRule = cssRules.rules[i] as Rule;
				// TODO 目前只针对顶层的规则类，其实还可以进一步优化
				if (styleRule.type === 'rule') {
					const theSelectors = styleRule.selectors as string[];
					const declarations = styleRule.declarations as Declaration[];
					// 记录命中对象但存在无效属性的情况
					const usedRule: IUnique = {};
					// 移除无效的选择器
					for (let si = theSelectors.length; si--;) {
						const matchNodes = getBySelector(dom, execSelector(theSelectors[si]));
						if (!matchNodes.length) {
							theSelectors.splice(si, 1);
						} else {
							let anyMatch = false;
							for (let mi = declarations.length; mi--;) {
								const ruleItem = declarations[mi];
								const property = ruleItem.property as string;
								// 判断每一条属性与每一个命中元素的匹配情况
								if (matchNodes.some(matchNode => checkApply(regularAttr[property], matchNode, dom, true))) {
									// 只要有一条匹配存在，就证明该选择器有效
									anyMatch = true;
									// 同时标记该属性有效
									usedRule[property] = true;
								}
							}
							if (!anyMatch) {
								theSelectors.splice(si, 1);
							}
						}
					}

					// 验证属性的有效性，移除无效的属性
					for (let ci = declarations.length; ci--;) {
						if (!usedRule[declarations[ci].property as string]) {
							declarations.splice(ci, 1);
						}
					}

					// 如果选择器列表经过筛选后为空，则移除该条规则
					if (!theSelectors.length) {
						cssRules.rules.splice(i, 1);
						i--;
						l--;
						continue;
					}

					// 合并相同选择器
					theSelectors.sort((a, b) => a < b ? -1 : 1);
					styleRule.selectors = theSelectors.map(s => mixWhiteSpace(s.trim()));
					const selectorKey = styleRule.selectors.join(',');
					if (selectorUnique.hasOwnProperty(selectorKey)) {
						const uDeclarations = (selectorUnique[selectorKey].declarations as Declaration[]).concat(styleRule.declarations as Declaration[]);
						// 合并之后依然要排重
						const declared: IUnique = {};
						for (let j = uDeclarations.length; j--;) {
							if (declared[uDeclarations[j].property as string]) {
								uDeclarations.splice(j, 1);
							} else {
								declared[uDeclarations[j].property as string] = true;
							}
						}
						selectorUnique[selectorKey].declarations = uDeclarations;
						cssRules.rules.splice(i, 1);
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
						for (let j = selectors.length; j--;) {
							if (selected[selectors[j]]) {
								selectors.splice(j, 1);
							} else {
								selected[selectors[j]] = true;
							}
						}
						declareUnique[declareKey].selectors = selectors;
						cssRules.rules.splice(i, 1);
						i--;
						l--;
						continue;
					} else {
						declareUnique[declareKey] = styleRule;
					}
				}
			}
		}
	}
	resolve();
});
