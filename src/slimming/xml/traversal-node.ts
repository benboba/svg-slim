/*
 * 遍历所有的 Node 节点，并对符合条件的节点执行操作
 * @param { function } 条件
 * @param { function } 回调
 * @param { Node } 目标节点
 */

import { INode } from '../../node/index';

function traversal<T extends INode>(condition: (n: INode) => boolean, cb: (n: T) => void, node: INode): void {
	// 此处不能用 forEach ，for 循环可以避免当前节点被移除导致下一个节点不会被遍历到的问题
	if (node.childNodes) {
		for (let i = 0; i < node.childNodes.length;) {
			const childNode = node.childNodes[i];
			if (condition(childNode)) {
				cb(childNode as T);
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
}

export function traversalNode<T extends INode>(condition: (n: INode) => boolean, cb: (n: T) => void, dom: INode): void {
	traversal(condition, cb, dom);
}
