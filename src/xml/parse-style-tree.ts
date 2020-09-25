import { Declaration, Rule, StyleRules } from 'css';
import { NodeType, parseSelector } from 'svg-vdom';
import { IDom, ITag } from '../../typings/node';
import { ISeletorPriority, IStyleAttr, IStyleObj } from '../../typings/style';
import { importantReg } from '../const/regs';
import { regularAttr } from '../const/regular-attr';
import { parseStyle } from '../style/parse';
import { getSelectorPriority, overrideAble } from '../style/seletor-priority';
import { hasProp } from '../utils/has-prop';

interface IStyleItem {
	styles: IStyleAttr[];
	selectorPriority: ISeletorPriority;
	nodes: ITag[];
}

const check = (dom: IDom, styleItems: IStyleItem[]) => {
	const tagNodes = dom.querySelectorAll(NodeType.Tag) as ITag[];
	tagNodes.forEach(node => {
		let nodeStyle: IStyleObj = {};
		if (node.styles) {
			nodeStyle = node.styles;
		} else {
			node.styles = nodeStyle;
		}

		// 可能有 xlink 引用，css 样式会影响到 xlink 引用的节点
		let xlinkObj: ITag | null | undefined;

		node.attributes.forEach(attr => {
			if (attr.fullname === 'style') {
				// 行内样式优先级最高
				const styles = parseStyle(attr.value);
				styles.forEach(style => {
					let override = false;
					if (nodeStyle[style.name] && nodeStyle[style.name].from === 'styletag') {
						if (nodeStyle[style.name].important && !style.important) {
							return;
						}
						// 标记覆盖了 styletag 中的属性
						override = true;
					}
					nodeStyle[style.name] = {
						value: style.value,
						from: 'inline',
						important: style.important,
						override,
					};
				});
			} else if (attr.name === 'href') {
				// 获取 xlink 引用
				xlinkObj = dom.querySelector(node.getAttribute(attr.fullname) as string) as (ITag | null);
			} else if (regularAttr[attr.fullname].couldBeStyle) {
				// 属性优先级最低，但可以覆盖继承
				const styleDefine = nodeStyle[attr.fullname];
				if (!styleDefine || styleDefine.from === 'inherit') {
					nodeStyle[attr.fullname] = {
						value: attr.value,
						from: 'attr',
					};
				}
			}
		});

		// 判断 style 标签内的样式，优先级高于 attr 和 inehrit
		styleItems.forEach(styleItem => {
			if (styleItem.nodes.includes(node)) {
				styleItem.styles.forEach(style => {
					const styleDefine = nodeStyle[style.name];
					if (
						!styleDefine || styleDefine.from === 'attr' || styleDefine.from === 'inherit'
						||
						(
							styleDefine.from === 'styletag'
							&&
							(
								(styleDefine.selectorPriority && overrideAble(styleItem.selectorPriority, styleDefine.selectorPriority) && styleDefine.important === style.important)
								||
								(!styleDefine.important && style.important)
							)
						)
						||
						(styleDefine.from === 'inline' && !styleDefine.important && style.important)
					) {
						nodeStyle[style.name] = {
							value: style.value,
							from: 'styletag',
							selectorPriority: styleItem.selectorPriority,
							important: style.important,
						};
					} else if (styleDefine && styleDefine.from === 'inline') {
						// 标记覆盖了 styletag 中的属性
						styleDefine.override = true;
					}
				});
			}
		});

		const parentNode = node.parentNode as ITag | undefined;
		if (parentNode && parentNode.styles) {
			// 可能从父元素继承的样式
			Object.keys(parentNode.styles).forEach(key => {
				if (!hasProp(nodeStyle, key) && regularAttr[key].inherited) {
					nodeStyle[key] = {
						value: (parentNode.styles as IStyleObj)[key].value,
						from: 'inherit',
					};
				}
			});
		}

		if (xlinkObj) {
			let styleObj: IStyleObj = {};
			if (xlinkObj.styles) {
				styleObj = xlinkObj.styles;
			} else {
				xlinkObj.styles = styleObj;
			}
			Object.keys(nodeStyle).forEach(key => {
				if (!hasProp(styleObj, key)) {
					styleObj[key] = {
						value: nodeStyle[key].value,
						from: 'inherit',
					};
				}
			});
		}

	});
};

// 解析样式树，为每个节点增加 styles 属性，标记当前节点生效的样式信息
export const parseStyleTree = (dom: IDom) => {
	// 首先清理掉曾经被解析过的样式树
	(dom.querySelectorAll(NodeType.Tag) as ITag[]).forEach(node => {
		if (node.styles) {
			delete node.styles;
		}
	});

	const styleItems: IStyleItem[] = [];

	// 记录 stylesheet 选择器权重和影响到的节点
	if (dom.stylesheet) {
		(dom.stylesheet.stylesheet as StyleRules).rules.forEach((styleRule: Rule) => {
			// 只针对规则类
			if (styleRule.type === 'rule' && styleRule.declarations && styleRule.selectors) {
				const styles: IStyleAttr[] = [];
				styleRule.declarations.forEach((ruleItem: Declaration) => {
					if (ruleItem.property && ruleItem.value) {
						styles.push({
							name: ruleItem.property,
							fullname: ruleItem.property,
							value: ruleItem.value.replace(importantReg, ''),
							important: importantReg.test(ruleItem.value),
						});
					}
				});

				for (let si = styleRule.selectors.length; si--;) {
					const selector = parseSelector(styleRule.selectors[si])[0];
					const selectorPriority = getSelectorPriority(selector);
					const nodes = dom.querySelectorAll(selector) as ITag[];
					if (nodes.length) {
						styleItems.push({
							styles,
							selectorPriority,
							nodes,
						});
					}
				}
			}
		});
	}

	check(dom, styleItems);
};
