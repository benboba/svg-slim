import { Declaration, Rule, StyleRules } from 'css';
import { parseSelector } from 'svg-vdom';
import { IDom, ITag } from '../../typings/node';
import { IStyleObj } from '../../typings/style';
import { importantReg } from '../const/regs';
import { regularAttr } from '../const/regular-attr';
import { parseStyle } from '../style/parse';
import { stringifyStyle } from '../style/stringify';
import { valueIsEqual } from '../xml/attr-is-equal';

export const applyStyle = async (dom: IDom): Promise<void> => new Promise(resolve => {
	if (dom.stylesheet) {
		const cssRules: StyleRules = dom.stylesheet.stylesheet as StyleRules;

		for (let i = cssRules.rules.length; i--;) {
			const styleRule = cssRules.rules[i] as Rule;
			if (styleRule.type === 'rule') {
				const declarations = styleRule.declarations as Declaration[];
				const matchNodes = dom.querySelectorAll(parseSelector((styleRule.selectors as string[]).join(','))) as ITag[];
				// 一条 CSS 规则只命中一个元素，才执行本优化
				if (matchNodes.length === 1) {
					const node = matchNodes[0];
					const nodeStyles = node.styles as IStyleObj;
					const nodeStyleAttr = parseStyle(node.getAttribute('style') || '');
					for (let mi = 0; mi < declarations.length; mi++) {
						const ruleItem = declarations[mi];
						const name = ruleItem.property as string;
						const isImportant = importantReg.test(ruleItem.value as string);
						const value = (ruleItem.value as string).replace(importantReg, '');
						const styleItem = nodeStyles[name];
						// 明确解析后来自 styletag 的样式才放到 style 属性中
						if (styleItem && styleItem.from === 'styletag' && valueIsEqual(regularAttr[name], styleItem.value, value)) {
							nodeStyleAttr.push({
								fullname: name,
								name,
								value,
								important: isImportant,
							});
						}
					}
					node.setAttribute('style', stringifyStyle(nodeStyleAttr));
					cssRules.rules.splice(i, 1);
				}
			}
		}
	}
	resolve();
});
