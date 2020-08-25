import { parse as cssParse, Declaration, KeyFrames, Media, Node, Rule } from 'css';
import { propEq, has } from 'ramda';
import { NodeType } from '../../node/index';
import { mixWhiteSpace } from '../utils/mix-white-space';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';
import { traversalObj } from '../utils/traversal-obj';
// import { legalCss } from '../validate/legal-css';
import { regularAttr } from '../const/regular-attr';
import { legalValue } from '../validate/legal-value';

const rmCSSNode = (cssNode: Node, plist: Node[]) => {
	const index = plist.indexOf(cssNode);
	if (index !== -1) {
		plist.splice(index, 1);
	}
};

// 合并多个 style 标签，并将文本节点合并到一个子节点
export const combineStyle = async (dom: IDomNode): Promise<null> => new Promise(resolve => {
	let firstStyle: ITagNode | undefined;
	let lastChildNode: INode | undefined;

	const checkCNode = (node: ITagNode) => {
		for (let i = 0; i < node.childNodes.length; i++) {
			const cNode = node.childNodes[i];
			if (cNode.nodeType !== NodeType.Text && cNode.nodeType !== NodeType.CDATA) {
				rmNode(cNode);
				i--;
			} else {
				cNode.textContent = mixWhiteSpace((cNode.textContent as string).trim());
				if (cNode.nodeType === NodeType.Text) {
					cNode.nodeType = NodeType.CDATA;
				}
				if (!lastChildNode) {
					lastChildNode = cNode;
				} else {
					lastChildNode.textContent += cNode.textContent;
					rmNode(cNode);
					i--;
				}
			}
		}
	};

	traversalNode<ITagNode>(propEq('nodeName', 'style'), node => {
		const type = node.getAttribute('type');
		if (type && type !== 'text/css') {
			rmNode(node);
			return;
		}
		if (firstStyle) {
			checkCNode(node);
			rmNode(node);
		} else {
			firstStyle = node;
			checkCNode(node);
		}
	}, dom);

	const ruleParents: Array<[{
		declarations: Declaration[];
	}, Node[]]> = [];

	if (firstStyle) {
		const childNodes = firstStyle.childNodes;
		if (childNodes.length === 0 || !childNodes[0].textContent || !childNodes[0].textContent.replace(/\s/g, '')) { // 如果内容为空，则移除style节点
			rmNode(firstStyle);
		} else {
			if (!childNodes[0].textContent.includes('<')) { // 如果没有危险代码，则由 CDATA 转为普通文本类型
				childNodes[0].nodeType = NodeType.Text;
			}

			// 解析 stylesheet 并缓存
			try {
				const parsedCss = cssParse(childNodes[0].textContent);
				if (parsedCss.stylesheet) {
					dom.stylesheet = parsedCss;
					dom.styletag = firstStyle;
					traversalObj<Node>(has('type'), (cssNode, parents) => {
						switch (cssNode.type) {
							case 'rule':
							case 'keyframe':
							case 'font-face':
							case 'page': {
								const cssRule = cssNode as Rule;
								if (!cssRule.declarations) {
									rmCSSNode(cssRule, parents[parents.length - 1] as Node[]);
									return;
								}
								const declared: IUnique = {};
								for (let i = cssRule.declarations.length; i--;) {
									const ruleItem = cssRule.declarations[i] as Declaration;
									// 1、移除不存在属性名或属性值的项
									// 2、排重
									if (!ruleItem.property || !ruleItem.value || declared[ruleItem.property]) {
										cssRule.declarations.splice(i, 1);
									} else {
										declared[ruleItem.property] = true;
									}
								}
								if (!cssRule.declarations.length) {
									rmCSSNode(cssRule, parents[parents.length - 1] as Node[]);
								} else {
									ruleParents.push([cssRule as Required<Rule>, parents[parents.length - 1] as Node[]]);
								}
								break;
							}
							case 'keyframes': {
								const keyframes = cssNode as KeyFrames;
								if (!keyframes.keyframes || !keyframes.keyframes.length) {
									rmCSSNode(cssNode, parents[parents.length - 1] as Node[]);
								}
								break;
							}
							case 'media':
							case 'host':
							case 'supports':
							case 'document': {
								const ruleParent = cssNode as Media;
								if (!ruleParent.rules || !ruleParent.rules.length) {
									rmCSSNode(cssNode, parents[parents.length - 1] as Node[]);
								}
								break;
							}
							case 'comment':
								rmCSSNode(cssNode, parents[parents.length - 1] as Node[]);
								break;
							default:
								break;
						}
					}, parsedCss.stylesheet.rules, true);
				} else {
					rmNode(firstStyle);
				}
			} catch (e) {
				rmNode(firstStyle);
			}
		}
	}

	if (ruleParents.length) {
		// (async () => {
		for (const [rule, parent] of ruleParents) {
		// 				if (typeof document === 'undefined') {
		// 					let cssString = 'text,rect{';
		// 					rule.declarations.forEach(d => {
		// 						cssString += `${d.property}:${d.value};
		// `;
		// 					});
		// 					cssString += '}';
		// 					const result = await legalCss(cssString);
		// 					if (!result.validity) {
		// 						result.errors.forEach(err => {
		// 							if (err.type === 'zero') { // 忽略没有单位导致的错误
		// 								return;
		// 							}
		// 							const styleItem = rule.declarations[err.line - 1] as Declaration | undefined;
		// 							if (styleItem && err.message.includes(styleItem.property as string)) { // cssValidator 有时候会报错行数，需要确保规则对得上
		// 								const styleDefine = regularAttr[styleItem.property as string];
		// 								// css 验证失败，还需要进行一次 svg-slimming 的合法性验证，确保没有问题
		// 								if (!styleDefine.legalValues.length || !legalValue(styleDefine, {
		// 									fullname: styleItem.property as string,
		// 									value: styleItem.value as string,
		// 									name: '',
		// 								})) {
		// 									styleItem.value = '';
		// 								}
		// 							}
		// 						});
		// 					}
		// 				}
			// 只做基本验证
			rule.declarations.forEach(styleItem => {
				const styleDefine = regularAttr[styleItem.property as string];
				if (!legalValue(styleDefine, {
					fullname: styleItem.property as string,
					value: styleItem.value as string,
					name: '',
				})) {
					styleItem.value = '';
				}
			});
			rule.declarations = rule.declarations.filter(item => !!item.value);
			if (!rule.declarations.length) {
				rmCSSNode(rule as Node, parent);
			}
		}
		// resolve();
		// })();
	}
	// } else {
	resolve();
	// }
});
