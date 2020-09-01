import { INode } from '../../../typings/node';
import { ISelector } from '../../../typings/style';
import { validPseudoClass, validPseudoElement } from '../const/definitions';
import { isTag } from '../xml/is-tag';
import { traversalNode } from '../xml/traversal-node';
import { attrModifier } from './define';

// 验证 className
const checkClass = (node: INode, selector: ISelector): boolean => {
	const className = node.getAttribute('class');
	let classNames: string[] = [];
	if (className) {
		classNames = className.trim().split(/\s+/);
	}
	for (let ci = selector.class.length; ci--;) {
		if (!classNames.includes(selector.class[ci])) {
			return false;
		}
	}
	return true;
};

// 验证 ID
const checkID = (node: INode, selector: ISelector): boolean => {
	let id = node.getAttribute('id');
	if (id) {
		id = id.trim();
	}
	for (let i = selector.id.length; i--;) {
		if (id !== selector.id[i]) {
			return false;
		}
	}
	return true;
};

// 验证属性
const checkAttr = (node: INode, selector: ISelector): boolean => {
	for (let ai = selector.attr.length; ai--;) {
		const attrSelector = selector.attr[ai];
		let attr = node.getAttribute(attrSelector.key);
		if (attr === null) {
			return false;
		} else if (attrSelector.value) {
			// 属性值大小写不敏感
			attr = attr.trim().toLowerCase();
			switch (attrSelector.modifier) {
				// 开始字符匹配
				case attrModifier['^']:
					if (attr.indexOf(attrSelector.value) !== 0) {
						return false;
					}
					break;
				// 结尾字符匹配
				case attrModifier['$']:
					if (attr.lastIndexOf(attrSelector.value) !== attr.length - attrSelector.value.length) {
						return false;
					}
					break;
				// 空格分组字符匹配
				case attrModifier['~']:
					if (!attr.split(/\s+/).includes(attrSelector.value)) {
						return false;
					}
					break;
				// 前缀字符匹配
				case attrModifier['|']:
					if (attr !== attrSelector.value && attr.indexOf(`${attrSelector.value}-`) !== 0) {
						return false;
					}
					break;
				// 模糊匹配
				case attrModifier['*']:
					if (!attr.includes(attrSelector.value)) {
						return false;
					}
					break;
				// 默认全字匹配
				default:
					if (attr !== attrSelector.value) {
						return false;
					}
					break;
			}
		}
	}
	return true;
};

// 验证伪类和伪元素
// 根据 SVG 标准只验证 CSS 2.1 规范的伪类和伪元素
// https://www.w3.org/TR/SVG2/styling.html#RequiredCSSFeatures
const checkPseudo = (node: INode, selector: ISelector): boolean => {
	for (let pi = selector.pseudo.length; pi--;) {
		const pseudoSelector = selector.pseudo[pi];
		if (!validPseudoClass.includes(pseudoSelector.func) && !validPseudoElement.includes(pseudoSelector.func)) {
			return false;
		}

		// 命中伪元素，需要验证作用域链上是否存在文本节点 text
		if (validPseudoElement.includes(pseudoSelector.func)) {
			let hasText = false;
			if (node.nodeName === 'text') {
				hasText = true;
			} else {
				traversalNode(isTag, (n: INode) => {
					if (n.nodeName === 'text') {
						hasText = true;
					}
				}, node);
			}
			if (!hasText) {
				return false;
			}
		}
	}
	return true;
};

// 验证 selector 和 node 是否匹配
export const matchSelector = (selector?: ISelector) => (node?: INode): boolean => {
	if (!selector || !node) {
		return false;
	}

	// 如果存在标签，则标签必须符合
	if (selector.type && selector.type !== node.nodeName) {
		return false;
	}

	// 如果存在 class 选择器，则每个 class 都要匹配
	if (selector.class.length) {
		if (!checkClass(node, selector)) {
			return false;
		}
	}

	// 如果存在 id 选择器，则每个 id 都要匹配
	if (selector.id.length) {
		if (!checkID(node, selector)) {
			return false;
		}
	}

	if (selector.attr.length) {
		if (!checkAttr(node, selector)) {
			return false;
		}
	}

	if (selector.pseudo.length) {
		if (!checkPseudo(node, selector)) {
			return false;
		}
	}

	return true;
};
