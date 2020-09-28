import { Declaration, KeyFrames, Media, Node, Rule } from 'css';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { parse: cssParse } = require('css');
import { has } from 'ramda';
import { ITagNode, ITextNode, NodeType } from 'svg-vdom';
import { TUnique } from '../../typings';
import { IDom } from '../../typings/node';
import { regularAttr } from '../const/regular-attr';
import { traversalObj } from '../utils/traversal-obj';
import { knownCSS } from '../validate/known-css';
import { legalValue } from '../validate/legal-value';
import { combineText } from '../xml/combine-text';

const rmCSSNode = (cssNode: Node, plist: Node[]) => {
	const index = plist.indexOf(cssNode);
	if (index !== -1) {
		plist.splice(index, 1);
	}
};

// 合并多个 style 标签，并将文本节点合并到一个子节点
export const combineStyle = async (dom: IDom): Promise<void> => new Promise(resolve => {
	let firstStyle: ITagNode | undefined;

	const styles = dom.querySelectorAll('style') as ITagNode[];
	styles.forEach(node => {
		const type = node.getAttribute('type');
		if (type && type !== 'text/css') {
			node.remove();
			return;
		}

		if (firstStyle) {
			firstStyle.appendChild(node.childNodes);
			node.remove();
		} else {
			firstStyle = node;
		}
	});

	const ruleParents: Array<[{
		declarations: Declaration[];
	}, Node[]]> = [];

	if (firstStyle) {
		combineText(firstStyle);
		const childNodes = firstStyle.childNodes as ITextNode[];
		if (childNodes.length !== 1 || !childNodes[0].textContent) { // 如果内容为空，则移除style节点
			firstStyle.remove();
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
								const declared: TUnique = {};
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
					firstStyle.remove();
				}
			} catch (e) {
				firstStyle.remove();
			}
		}
	}

	if (ruleParents.length) {
		for (const [rule, parent] of ruleParents) {
			// 只做基本验证
			rule.declarations.forEach(styleItem => {
				const styleDefine = regularAttr[styleItem.property as string];
				if (
					!legalValue(styleDefine, {
						fullname: styleItem.property as string,
						value: styleItem.value as string,
						name: '',
					})
					&&
					!knownCSS(styleItem.property as string)
				) {
					styleItem.value = '';
				}
			});
			rule.declarations = rule.declarations.filter(item => !!item.value);
			if (!rule.declarations.length) {
				rmCSSNode(rule as Node, parent);
			}
		}
	}
	resolve();
});
