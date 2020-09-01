import { Declaration, Node, Rule, StyleRules } from 'css';
import { propEq } from 'ramda';
import { IRuleOption, TUnique } from '../../../typings';
import { IDomNode } from '../../../typings/node';
import { regularAttr } from '../const/regular-attr';
import { checkApply } from '../style/check-apply';
import { parseSelector } from '../style/parse-selector';
import { hasProp } from '../utils/has-prop';
import { mixWhiteSpace } from '../utils/mix-white-space';
import { traversalObj } from '../utils/traversal-obj';
import { valueIsEqual } from '../xml/attr-is-equal';
import { getBySelector } from '../xml/get-by-selector';

interface ICSSUnique {
	[propName: string]: Rule;
}

const rmCSSNode = (cssNode: Node, plist: Node[]) => {
	const index = plist.indexOf(cssNode);
	if (index !== -1) {
		plist.splice(index, 1);
	}
};

export const shortenStyleTag = async (dom: IDomNode, {
	option: {
		deepShorten,
	},
	params: {
		rmAttrEqDefault,
	},
}: IRuleOption): Promise<void> => new Promise(resolve => {
	if (dom.stylesheet) {
		const cssRules: StyleRules = dom.stylesheet.stylesheet as StyleRules;

		// 遍历 style 解析对象，取得包含 css 定义的值
		traversalObj<Declaration>(propEq('type', 'declaration'), (cssNode, parents) => {
			const attrDefine = regularAttr[cssNode.property as string];
			if (!attrDefine.couldBeStyle) {
				rmCSSNode(cssNode, parents[parents.length - 1] as Rule[]);
			} else if (rmAttrEqDefault) {
				// 仅验证只有一种默认值的情况
				if (typeof attrDefine.initValue === 'string' && valueIsEqual(attrDefine, cssNode.value as string, attrDefine.initValue)) {
					rmCSSNode(cssNode, parents[parents.length - 1] as Rule[]);
				}
			}
		}, cssRules.rules, true);

		// TODO css all 属性命中后要清空样式
		// TODO 连锁属性的判断
		// TODO 直接把 style 应用到元素
		// 深度优化
		if (deepShorten) {
			const selectorUnique: ICSSUnique = {};
			const declareUnique: ICSSUnique = {};
			for (let i = 0, l = cssRules.rules.length; i < l; i++) {
				const styleRule = cssRules.rules[i] as Rule;
				// TODO 目前只针对顶层的规则类，其实还可以进一步优化
				if (styleRule.type === 'rule') {
					const theSelectors = styleRule.selectors as string[];
					const declarations = styleRule.declarations as Declaration[];
					// 记录命中对象但存在无效属性的情况
					const usedRule: TUnique = {};
					// 移除无效的选择器
					for (let si = theSelectors.length; si--;) {
						const matchNodes = getBySelector(dom, parseSelector(theSelectors[si]));
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
					if (hasProp(selectorUnique, selectorKey)) {
						const uDeclarations = (selectorUnique[selectorKey].declarations as Declaration[]).concat(styleRule.declarations as Declaration[]);
						// 合并之后依然要排重
						const declared: TUnique = {};
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
					if (hasProp(declareUnique, declareKey)) {
						const selectors: string[] = (declareUnique[declareKey].selectors as string[]).concat(styleRule.selectors);
						const selected: TUnique = {};
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
