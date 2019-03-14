import { Declaration, parse as cssParse, Rule, Stylesheet } from 'css';
import { propEq } from 'ramda';
import { IAttr } from '../../node';
import { regularAttr } from '../const/regular-attr';
import { IStyleObj, ITagNode } from '../interface/node';
import { ISeletorPriority } from '../style/define';
import { execStyle } from '../style/exec';
import { execSelector } from '../style/exec-selector';
import { getSelectorPriority, overrideAble } from '../style/seletor-priority';
import { getById } from './get-by-id';
import { getBySelector } from './get-by-selector';
import { isTag } from './is-tag';
import { traversalNode } from './traversal-node';

interface IStyleItem {
	styles: IAttr[];
	selectorPriority: ISeletorPriority;
	nodes: ITagNode[];
}

function check(dom: ITagNode, styleItems: IStyleItem[]) {
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
						from: 'inline'
					};
				});
			} else if (attr.fullname === 'xlink:href') {
				// 获取 xlink 引用
				xlinkObj = getById(node.getAttribute('xlink:href') as string, dom) as ITagNode;
			} else if (regularAttr[attr.fullname].couldBeStyle) {
				// 属性优先级最低，但可以覆盖继承
				const styleDefine = nodeStyle[attr.fullname];
				// tslint:disable-next-line
				if (!styleDefine || styleDefine.from === 'inherit') {
					nodeStyle[attr.fullname] = {
						value: attr.value,
						from: 'attr'
					};
				}
			}
		});

		// 判断 style 标签内的样式，优先级高于 attr 和 inehrit
		styleItems.forEach(styleItem => {
			if (styleItem.nodes.indexOf(node) !== -1) {
				styleItem.styles.forEach(style => {
					const styleDefine = nodeStyle[style.name];
					// tslint:disable-next-line
					if (!styleDefine || styleDefine.from === 'attr' || styleDefine.from === 'inherit' || (styleDefine.from === 'styletag' && styleDefine.selectorPriority && overrideAble(styleItem.selectorPriority, styleDefine.selectorPriority))) {
						nodeStyle[style.name] = {
							value: style.value,
							from: 'styletag',
							selectorPriority: styleItem.selectorPriority
						};
					}
				});
			}
		});

		const parentNode = node.parentNode as ITagNode | undefined;
		if (parentNode && parentNode.styles) {
			// 可能从父元素继承的样式
			Object.keys(parentNode.styles).forEach(key => {
				if (!nodeStyle.hasOwnProperty(key)) {
					if (parentNode.styles && parentNode.styles.hasOwnProperty(key)) {
						nodeStyle[key] = {
							value: parentNode.styles[key].value,
							from: 'inherit'
						};
					}
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
				if (!styleObj.hasOwnProperty(key)) {
					styleObj[key] = {
						value: nodeStyle[key].value,
						from: 'inherit'
					};
				}
			});
		}

	}, dom);
}

// 解析样式树，为每个节点增加 styles 属性，标记当前节点生效的样式信息
export function execStyleTree(dom: ITagNode) {
	// 首先清理掉曾经被解析过的样式树
	traversalNode<ITagNode>(isTag, node => {
		if (node.styles) {
			delete node.styles;
		}
	}, dom);

	let parsedCss: Stylesheet;
	const styleItems: IStyleItem[] = [];

	// 首先对 style 标签做处理，解析出所有起作用的 css 定义，并记录它们的选择器权重和影响到的节点
	traversalNode<ITagNode>(propEq('nodeName', 'style'), node => {
		const cssContent = node.childNodes[0];
		parsedCss = cssParse(cssContent.textContent as string);

		if (parsedCss.stylesheet) {
			parsedCss.stylesheet.rules.forEach((styleRule: Rule) => {
				// 只针对规则类
				if (styleRule.type === 'rule' && styleRule.declarations && styleRule.selectors) {
					const styles: IAttr[] = [];
					styleRule.declarations.forEach((ruleItem: Declaration) => {
						if (ruleItem.property && ruleItem.value) {
							styles.push({
								name: ruleItem.property,
								fullname: ruleItem.property,
								value: ruleItem.value
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
								nodes
							});
						}
					}
				}
			});
		}
	}, dom);

	check(dom, styleItems);
}
