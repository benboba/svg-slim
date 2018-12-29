/*
 * 遍历所有的 Node 节点，并对符合条件的节点执行操作
 * @param { function } 条件
 * @param { function } 回调
 * @param { Node } 目标节点
 */

import { INode } from '../../node/index';

function traversal<T extends INode>(condition: (n: T) => boolean, cb: (n: T) => void, node: T): void {
	// 此处不能用 forEach ，for 循环可以避免当前节点被移除导致下一个节点不会被遍历到的问题
	for (let i = 0; i < node.childNodes.length; ) {
		const childNode = node.childNodes[i] as T;
		if (condition(childNode)) {
			cb(childNode);
			if (childNode === node.childNodes[i]) {
				if (childNode.childNodes && childNode.childNodes.length) {
					traversal(condition, cb, childNode);
				}
				i++;
			}
		} else {
			if (childNode.childNodes && childNode.childNodes.length) {
				traversal(condition, cb, childNode);
			}
			i++;
		}
	}
}

export function traversalNode<T extends INode>(condition: (n: T) => boolean, cb: (n: T) => void, dom: T): void {
	traversal(condition, cb, dom);
}