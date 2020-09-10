import { IDocument, INode } from 'svg-vdom';
import { IRegularAttr } from '../../typings';
import { ITag } from '../../typings/node';
import { isTag } from '../xml/is-tag';
import { parseStyle } from './parse';

// TODO：目前只验证了 href 和 xlink:href，其它 IRI 或 funcIRI 属性是否也需要验证？
// 遇到引用属性，还需要递归验证被引用对象是否可应用样式
const getXlink = (
	styleDefine: IRegularAttr,
	idStr: string,
	dom: IDocument,
	unique: Set<INode>,
	fromStyleTag: boolean,
) => check(styleDefine, dom.querySelector(idStr) as ITag, dom, unique, fromStyleTag);

// 定义一个特殊的遍历方法，只接收一个 condition 方法，只有该方法返回 true 才继续遍历子元素
const traversal = (condition: (n: INode) => boolean, node: INode): void => {
	if (!isTag(node)) return;
	// 此处不能用 forEach ，for 循环可以避免当前节点被移除导致下一个节点不会被遍历到的问题
	for (const childNode of node.childNodes as INode[]) {
		if (condition(childNode)) {
			traversal(condition, childNode);
		}
	}
};

const check = (styleDefine: IRegularAttr, node: ITag | null, dom: IDocument, unique: Set<INode>, fromStyleTag: boolean): boolean => {
	if (!node) return false;

	// 如果是检测 style 标签的样式，则只要遇到同名的 style 属性就返回 false
	if (fromStyleTag) {
		for (let i = node.attributes.length; i--;) {
			const attr = node.attributes[i];
			if (attr.fullname === 'style') {
				const childStyle = parseStyle(attr.value);
				if (childStyle.some(style => style.fullname === styleDefine.name)) {
					return false;
				}
			}
		}
	}

	if (styleDefine.applyTo.includes(node.nodeName)) return true;

	// 因为递归可能存在循环引用，所以需要排重
	if (unique.has(node)) {
		return false;
	}

	unique.add(node);

	let result = false;

	if (node.hasAttribute('href')) {
		result = getXlink(styleDefine, node.getAttribute('href') as string, dom, unique, false);
	} else if (node.hasAttribute('xlink:href')) {
		result = getXlink(styleDefine, node.getAttribute('xlink:href') as string, dom, unique, false);
	}

	// 已经命中就不需要再继续了
	if (result) return true;

	// 逻辑在判断函数里做，不在回调函数里做
	traversal((childNode: INode) => {
		// 已经命中就不再继续
		if (result) return false;

		// 只验证元素节点
		if (!isTag(childNode)) return false;

		// 因为递归可能存在循环引用，所以需要排重
		if (unique.has(childNode)) return false;
		unique.add(childNode);

		// 检查属性看是否被覆盖，是就不再继续
		for (let i = childNode.attributes.length; i--;) {
			const attr = childNode.attributes[i];
			if (attr.fullname === 'style') {
				const childStyle = parseStyle(attr.value);
				if (childStyle.some(style => style.fullname === styleDefine.name)) {
					return false;
				}
			} else if (attr.fullname === styleDefine.name) {
				return false;
			}
		}

		// 通过前面的验证，并符合样式应用条件，就找到了命中的结果
		if (styleDefine.applyTo.includes(childNode.nodeName)) {
			result = true;
			return false; // 已经有命中的结果就不必再遍历了
		} else { // 否则继续遍历子元素
			// 没有命中，但具有 IRI 引用，则继续
			if (childNode.hasAttribute('href')) {
				if (getXlink(styleDefine, childNode.getAttribute('href') as string, dom, unique, fromStyleTag)) {
					result = true;
					return false;
				}
			} else if (childNode.hasAttribute('xlink:href')) {
				if (getXlink(styleDefine, childNode.getAttribute('xlink:href') as string, dom, unique, fromStyleTag)) {
					result = true;
					return false;
				}
			}
			return true;
		}
	}, node);
	return result;
};

// 深度分析，判断样式继承链上是否存在可应用对象
export const checkApply = (
	styleDefine: IRegularAttr,
	node: ITag,
	dom: IDocument,
	fromStyleTag = false, // 标记是否为检测 style 标签的样式
): boolean => check(styleDefine, node, dom, new Set<INode>(), fromStyleTag);
