import { INode, IAttr } from '../../node/index';
import { IRegularAttr } from '../const/regular-attr';
import { getById } from '../xml/get-by-id';
import { isTag } from '../xml/is-tag';
import { execStyle } from './exec';

// TODO：只有 xlink:href 吗？其它 IRI 或 funcIRI 属性是否也需要验证？
// 遇到引用属性，还需要递归验证被引用对象是否可应用样式
const getXlink = (styleDefine: IRegularAttr, idStr: string, dom: INode, unique: INode[], fromStyleTag: boolean) => check(styleDefine, getById(idStr, dom), dom, unique, fromStyleTag);

// 定义一个特殊的遍历方法，只接收一个 condition 方法，只有该方法返回 true 才继续遍历子元素
const traversal = (condition: (n: INode) => boolean, node: INode): void => {
	// 此处不能用 forEach ，for 循环可以避免当前节点被移除导致下一个节点不会被遍历到的问题
	for (const childNode of node.childNodes as INode[]) {
		if (condition(childNode) && childNode.childNodes && childNode.childNodes.length) {
			traversal(condition, childNode);
		}
	}
};

const check = (styleDefine: IRegularAttr, node: INode | undefined, dom: INode, unique: INode[], fromStyleTag: boolean): boolean => {
	if (!node) return false;

	// 如果是检测 style 标签的样式，则只要遇到同名的 style 属性就返回 false
	if (fromStyleTag) {
		for (let i = (node.attributes as IAttr[]).length; i--;) {
			const attr = (node.attributes as IAttr[])[i];
			if (attr.fullname === 'style') {
				const childStyle = execStyle(attr.value);
				if (childStyle.some(style => style.fullname === styleDefine.name)) {
					return false;
				}
			}
		}
	}

	if (styleDefine.applyTo.indexOf(node.nodeName) !== -1) return true;

	// 因为递归可能存在循环引用，所以需要排重
	if (unique.indexOf(node) !== -1) {
		return false;
	}

	unique.push(node);

	let result = false;

	if (node.hasAttribute('xlink:href')) {
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
		if (unique.indexOf(childNode) !== -1) return false;
		unique.push(childNode);

		// 检查属性看是否被覆盖，是就不再继续
		for (let i = (childNode.attributes as IAttr[]).length; i--;) {
			const attr = (childNode.attributes as IAttr[])[i];
			if (attr.fullname === 'style') {
				const childStyle = execStyle(attr.value);
				if (childStyle.some(style => style.fullname === styleDefine.name)) {
					return false;
				}
			} else if (attr.fullname === styleDefine.name) {
				return false;
			}
		}

		// 通过前面的验证，并符合样式应用条件，就找到了命中的结果
		if (styleDefine.applyTo.indexOf(childNode.nodeName) !== -1) {
			result = true;
			return false; // 已经有命中的结果就不必再遍历了
		} else { // 否则继续遍历子元素
			// 没有命中，但具有 IRI 引用，则继续
			if (childNode.hasAttribute('xlink:href')) {
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
	node: INode,
	dom: INode,
	fromStyleTag = false // 标记是否为检测 style 标签的样式
): boolean => check(styleDefine, node, dom, [], fromStyleTag);
