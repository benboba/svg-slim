/*
 * 遍历所有的 Node 节点，并对符合条件的节点执行操作，异步版本
 * @param { function } 条件
 * @param { function } 回调
 * @param { Node } 目标节点
 */

import { INode } from 'typings/node';

export const traversalNodeAsync = async <T extends INode>(condition: (n: INode) => boolean | void, cb: (n: T) => Promise<void>, node: INode) => new Promise<void>((resolve, reject) => {
	if (node.childNodes && node.childNodes.length) {
		const list: Array<Promise<void>> = [];
		for (const childNode of node.childNodes) {
			if (condition(childNode)) {
				list.push(new Promise<void>(resv => {
					Promise.resolve().then(async () => {
						await cb(childNode as T);
						if (childNode.parentNode === node) {
							await traversalNodeAsync(condition, cb, childNode);
						}
						resv();
					});
				}));
			} else {
				list.push(new Promise<void>(resv => {
					Promise.resolve().then(async () => {
						await traversalNodeAsync(condition, cb, childNode);
						resv();
					});
				}));
			}
		}
		Promise.all<void>(list).then(() => {
			resolve();
		}, reject);
	} else {
		resolve();
	}
});
