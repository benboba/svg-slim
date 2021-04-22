import { Declaration, Rule, StyleRules } from 'css';
import { NodeType, parseSelector } from 'svg-vdom';
import { IDom, ITag } from '../../typings/node';
import { IStyleObj } from '../../typings/style';
import { importantReg } from '../const/regs';
import { regularAttr } from '../const/regular-attr';
import { parseStyle } from '../style/parse';
import { getSelectorPriority, overrideAble } from '../style/seletor-priority';
import { styleToValue } from '../style/style-to-value';
import { valueIsEqual } from '../xml/attr-is-equal';
import { parseStyleTree } from '../xml/parse-style-tree';

export const rmImportant = async (dom: IDom): Promise<void> => new Promise(resolve => {
	parseStyleTree(dom);
	// 1、不存在 override，或 override 的目标不具备 !important 的时候，所有 style 属性中的 !important 可以移除
	// 2、styletag 中的样式，如果没有成功应用到任何目标元素，可以移除 !important，或应用成功，但是并非依赖 !important
	if (dom.stylesheet) {
		// 遍历 style 解析对象，取得包含 css 定义的值
		(dom.stylesheet.stylesheet as StyleRules).rules.forEach((styleRule: Rule) => {
			// 只针对规则类
			if (styleRule.type === 'rule' && styleRule.declarations && styleRule.selectors) {
				// 缓存所有的 !important
				const importantMap = new Map<string, Declaration>();
				styleRule.declarations.forEach((ruleItem: Declaration) => {
					if (ruleItem.property && ruleItem.value) {
						if (importantReg.test(ruleItem.value)) {
							importantMap.set(ruleItem.property, ruleItem);
						}
					}
				});
				if (importantMap.size) {
					for (let si = styleRule.selectors.length; si--;) {
						const selector = parseSelector(styleRule.selectors[si])[0];
						const selectorPriority = getSelectorPriority(selector);
						const nodes = dom.querySelectorAll(selector) as ITag[];
						if (nodes.length) {
							nodes.forEach(node => {
								const nodeStyles = node.styles as IStyleObj;
								for (const [key, decl] of importantMap) {
									// 当前样式被成功应用
									if (nodeStyles[key].from === 'styletag' && valueIsEqual(regularAttr[key], nodeStyles[key].value, (decl.value as string).replace(importantReg, ''))) {
										if (
											nodeStyles[key].overrideList.some( // 列举一些 !important 不能被移除的情况
												ovr => 
													ovr.from === 'inline' // 覆盖的目标是行内样式
													||
													(
														(
															ovr.important // 覆盖的目标具有 !important
															||
															overrideAble(ovr.selectorPriority, selectorPriority) // 覆盖目标的选择器优先级高于当前选择器
														)
														&&
														!valueIsEqual(regularAttr[key], ovr.value, decl.value as string) // 且 value 不相等
													)
											)
										) {
											// 如果当前样式的优先级依赖了 !important，则不能移除，需要从缓存中移除
											importantMap.delete(key);
										}
									}
								}
							});
						}
					}
					for (const decl of importantMap.values()) {
						decl.value = (decl.value as string).replace(importantReg, '');
					}
				}
			}
		});
	}

	// styletag 优化后需要再次解析样式树
	parseStyleTree(dom);

	const tags = dom.querySelectorAll(NodeType.Tag) as ITag[];
	tags.forEach(node => {
		if (node.hasAttribute('style')) {
			const nodeStyles = node.styles as IStyleObj;
			const styleList = parseStyle(node.getAttribute('style') as string);
			styleList.forEach(style => {
				if (style.important) {
					if ((nodeStyles[style.fullname].overrideList as Array<{
						important?: boolean;
						value: string;
					}>).every(ovr => !ovr.important || valueIsEqual(regularAttr[style.fullname], ovr.value, style.value))) {
						style.important = false;
					}
				}
			});
			node.setAttribute('style', styleToValue(styleList));
		}
	});
	resolve();
});
