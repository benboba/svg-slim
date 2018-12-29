// 合并属性和样式完全相同的路径
import { has } from 'ramda';
import { IAttr } from 'src/node';
import { ConfigItem } from '../config/config';
import { IStyleNode } from '../interface/node';
// import { doCompute } from '../path/do-compute';
// import { execPath } from '../path/exec';
import { execStyleTree } from '../xml/exec-style-tree';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';
// import { plus } from '../math/plus';

interface IPathChildrenItem {
	attr: IAttr;
	index: number;
	node: IStyleNode;
}

interface IPathChildren {
	[propName: string]: IPathChildrenItem;
}

// // TODO 验证路径是否相交
// function checkPath(str: string) {
// 	const paths: number[][] = [];
// 	const pathItems = doCompute(execPath(str));
// 	let verify = true;
// 	let currentPath: number[] = [];
// 	pathItems.every(item => {
// 		switch (item.type) {
// 			// 平移 - 绝对
// 			case 'M':
// 				currentPath = [item.val[0], item.val[1]];
// 				paths.push(currentPath);
// 				return true;
// 			case 'm':
// 				currentPath = [plus(item.from[0], item.val[0]), plus(item.from[1], item.val[1])];
// 				paths.push(currentPath);
// 				return true;
// 			case 'Z':
// 			case 'z':
// 				currentPath.push(currentPath[0], currentPath[1]);
// 				return true;
// 			// 水平直线 - 绝对
// 			case 'H':
// 				item.val.forEach(val => {
// 					currentPath.push(val, item.from[1]);
// 				});
// 				return true;
// 			// 水平直线 - 相对
// 			case 'h':
// 				item.val.reduce((accumulator, val) => {
// 					currentPath.push(plus(val, accumulator), item.from[1]);
// 					return plus(val, accumulator);
// 				}, item.from[0]);
// 				return true;
// 			// 垂直直线 - 绝对
// 			case 'V':
// 				item.val.forEach(val => {
// 					currentPath.push(item.from[0], val);
// 				});
// 				return true;
// 			// 垂直直线 - 相对
// 			case 'v':
// 				item.val.reduce((accumulator, val) => {
// 					currentPath.push(item.from[0], plus(val, accumulator));
// 					return plus(val, accumulator);
// 				}, item.from[1]);
// 				return true;
// 			// 直线 - 绝对
// 			case 'L':
// 				currentPath.push(...item.val);
// 				return true;
// 			// 直线 - 相对
// 			case 'l':
// 				currentPath.reduce((accumulator, val, index) => {
// 					currentPath.push(plus(accumulator[index % 2], val));
// 					return [plus(accumulator[0], val * (1 - (index % 2))), plus(accumulator[1], val * (index % 2))];
// 				}, item.from);
// 				return true;
// 			default:
// 				verify = false;
// 				return false;
// 		}
// 	});
// 	return {
// 		verify,
// 		paths
// 	};
// }

// function noJoin(attr1: string, attr2: string): boolean {
// 	const checkResult1 = checkPath(attr1);
// 	const checkResult2 = checkPath(attr2);
// 	if (checkResult1.verify && checkResult2.verify) {
// 		// TODO： 验证碰撞
// 	}
// 	return true;
// }

function canbeCombine(node1: IStyleNode, node2: IStyleNode, attr: IAttr): boolean {
	const styles = node1.styles;
	return !!(styles.fill && styles.fill.value === 'none') || !styles.stroke || styles.stroke.value === 'none'/* || noJoin(attr.value, node2.getAttribute('d'))*/;
}

function getKey(node: IStyleNode): string {
	const keyObj = {
		attr: '',
		inline: '',
		styletag: '',
		inherit: ''
	};
	Object.keys(node.styles).forEach(key => {
		const define = node.styles[key];
		keyObj[define.from] += `${key}=${define.value}&`;
	});
	return `attr:${keyObj.attr}|inline:${keyObj.inline}|styletag:${keyObj.styletag}|inherit:${keyObj.inherit}`;
}

export const combinePath = (rule: ConfigItem, dom: IStyleNode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		execStyleTree(dom);

		traversalNode(isTag, (node: IStyleNode) => {
			const pathChildren: IPathChildren = {};
			let tagIndex = 0;
			for (let i = 0; i < node.childNodes.length; i++) {
				const childNode = node.childNodes[i];
				if (childNode.nodeName === 'path') {
					let d: IAttr;
					let k = '';
					childNode.attributes.forEach(attr => {
						if (attr.fullname === 'd') {
							d = attr;
						} else if (attr.fullname !== 'style') {
							k += `${attr.fullname}=${attr.value}&`;
						}
					});

					if (d) {
						const key = `${k}|${getKey(childNode)}`;
						if (has(key, pathChildren)) {
							// 允许路径合并的条件：1、所有属性和样式（包括继承样式）相同；2、相邻；3、没有 fill 或 stroke；4、路径没有相交或包含
							if (pathChildren[key].index === tagIndex - 1 && canbeCombine(childNode, pathChildren[key].node, d)) {
								pathChildren[key].attr.value += d.value;
								rmNode(childNode);
								i--;
							} else {
								pathChildren[key] = {
									attr: d,
									index: tagIndex,
									node: childNode
								};
							}
						} else {
							pathChildren[key] = {
								attr: d,
								index: tagIndex,
								node: childNode
							};
						}
					}
				}
				if (isTag(childNode)) {
					tagIndex++;
				}
			}
		}, dom);
	}
	resolve();
});