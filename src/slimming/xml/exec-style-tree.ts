import { Declaration, Rule, StyleRules } from 'css';
import { regularAttr } from '../const/regular-attr';
import { execStyle } from '../style/exec';
import { execSelector } from '../style/exec-selector';
import { getSelectorPriority, overrideAble } from '../style/seletor-priority';
import { hasProp } from '../utils/has-prop';
import { getById } from './get-by-id';
import { getBySelector } from './get-by-selector';
import { isTag } from './is-tag';
import { traversalNode } from './traversal-node';

interface IStyleItem {
	styles: IAttr[];
	selectorPriority: ISeletorPriority;
	nodes: ITagNode[];
}

const check = (dom: IDomNode, styleItems: IStyleItem[]) => {
	traversalNode<ITagNode>(isTag, node => {
		let nodeStyle: IStyleObj = {};
		if (node.styles) {
			nodeStyle = node.styles;
		} else {
			node.styles = nodeStyle;
		}

		// 可能有 xlink 引用，css 样式会影响到 xlink 引用的节点
		let xlinkObj: ITagNode | undefined;

		node.attributes.forEach(attr => {
			if (attr.fullname === 'style') {
				// 行内样式优先级最高
				const styles = execStyle(attr.value);
				styles.forEach(style => {
					nodeStyle[style.name] = {
						value: style.value,
						from: 'inline',
					};
				});
			} else if (attr.name === 'href') {
				// 获取 xlink 引用
				xlinkObj = getById(node.getAttribute(attr.fullname) as string, dom);
			} else if (regularAttr[attr.fullname].couldBeStyle) {
				// 属性优先级最低，但可以覆盖继承
				const styleDefine = nodeStyle[attr.fullname];
				// tslint:disable-next-line
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
					// tslint:disable-next-line
					if (!styleDefine || styleDefine.from === 'attr' || styleDefine.from === 'inherit' || (styleDefine.from === 'styletag' && styleDefine.selectorPriority && overrideAble(styleItem.selectorPriority, styleDefine.selectorPriority))) {
						nodeStyle[style.name] = {
							value: style.value,
							from: 'styletag',
							selectorPriority: styleItem.selectorPriority,
						};
					}
				});
			}
		});

		const parentNode = node.parentNode as ITagNode | undefined;
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

	}, dom);
};

// 解析样式树，为每个节点增加 styles 属性，标记当前节点生效的样式信息
export const execStyleTree = (dom: IDomNode) => {
	// 首先清理掉曾经被解析过的样式树
	traversalNode<ITagNode>(isTag, node => {
		if (node.styles) {
			delete node.styles;
		}
	}, dom);

	const styleItems: IStyleItem[] = [];

	// 记录 stylesheet 选择器权重和影响到的节点
	if (dom.stylesheet) {
		(dom.stylesheet.stylesheet as StyleRules).rules.forEach((styleRule: Rule) => {
			// 只针对规则类
			if (styleRule.type === 'rule' && styleRule.declarations && styleRule.selectors) {
				const styles: IAttr[] = [];
				styleRule.declarations.forEach((ruleItem: Declaration) => {
					if (ruleItem.property && ruleItem.value) {
						styles.push({
							name: ruleItem.property,
							fullname: ruleItem.property,
							value: ruleItem.value,
						});
					}
				});

				for (let si = styleRule.selectors.length; si--;) {
					const selector = execSelector(styleRule.selectors[si]);
					const selectorPriority = getSelectorPriority(selector);
					const nodes = getBySelector(dom, selector);
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
