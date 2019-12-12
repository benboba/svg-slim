// 合并属性和样式完全相同的路径
import { has } from 'ramda';
import { exec as execColor } from '../color/exec';
import { validOpacity } from '../color/valid';
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
	node: ITagNode;
}

interface IPathChildren {
	[propName: string]: IPathChildrenItem;
}

// // TODO 验证路径是否相交
// const checkPath = (str: string) => {
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

// const noJoin = (attr1: string, attr2: string): boolean => {
// 	const checkResult1 = checkPath(attr1);
// 	const checkResult2 = checkPath(attr2);
// 	if (checkResult1.verify && checkResult2.verify) {
// 		// TODO： 验证碰撞
// 	}
// 	return true;
// }

const execOpacity = (opacity: string): number => {
	if (opacity[opacity.length - 1] === '%') {
		return validOpacity(opacity.length, '%', opacity.slice(0, opacity.length - 1));
	} else {
		return validOpacity(opacity.length, '', opacity);
	}
};

const canbeCombine = (node1: ITagNode, node2: ITagNode, attr: IAttr, combineFill: boolean, combineOpacity: boolean): boolean => {
	const styles = node1.styles as IStyleObj;
	const noOpacity: boolean = !styles.hasOwnProperty('opacity') || execOpacity(styles.opacity.value) === 1;
	const noStrokeOpacity: boolean = execColor(styles.hasOwnProperty('stroke') ? styles.stroke.value : '').a === 1 && (!styles.hasOwnProperty('stroke-opacity') || execOpacity(styles['stroke-opacity'].value) === 1);
	const noFillOpacity: boolean = execColor(styles.hasOwnProperty('fill') ? styles.fill.value : '').a === 1 && (!styles.hasOwnProperty('fill-opacity') || execOpacity(styles['fill-opacity'].value) === 1);
	// fill 为空
	const noFill: boolean = styles.hasOwnProperty('fill') && styles.fill.value === 'none' && (combineOpacity || (noOpacity && noStrokeOpacity));
	// 填充规则不能是 evenodd 必须是 nonzero
	const noEvenOdd: boolean = !styles.hasOwnProperty('fill-rule') || styles['fill-rule'].value !== 'evenodd';
	// stroke 为空
	const noStroke: boolean = (!styles.hasOwnProperty('stroke') || styles.stroke.value === 'none') && (combineOpacity || (noOpacity && noFillOpacity));
	return noFill || (combineFill && noStroke && noEvenOdd)/* || noJoin(attr.value, node2.getAttribute('d'))*/;
};

const getKey = (node: ITagNode): string => {
	const keyObj = {
		attr: '',
		inline: '',
		styletag: '',
		inherit: '',
	};
	const styles = node.styles as IStyleObj;
	Object.keys(styles).forEach(key => {
		const define = styles[key];
		keyObj[define.from] += `${key}=${define.value}&`;
	});
	return `attr:${keyObj.attr}|inline:${keyObj.inline}|styletag:${keyObj.styletag}|inherit:${keyObj.inherit}`;
};

export const combinePath = async (rule: TConfigItem[], dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		execStyleTree(dom as ITagNode);

		traversalNode<ITagNode>(isTag, node => {
			const pathChildren: IPathChildren = {};
			let tagIndex = 0;
			for (let i = 0; i < node.childNodes.length; i++) {
				const childNode = node.childNodes[i] as ITagNode;
				if (childNode.nodeName === 'path') {
					let d: IAttr | undefined;
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
							// 允许路径合并的条件：1、所有属性和样式（包括继承样式）相同；2、相邻；3、没有 fill 或 stroke；4、所有可见透明度 ≥ 1；5、路径没有相交或包含（未实现）
							if (pathChildren[key].index === tagIndex - 1 && canbeCombine(childNode, pathChildren[key].node, d, rule[1] as boolean, rule[2] as boolean)) {
								// 路径拼合时，第一个 m 要转为绝对，否则会有 bug
								pathChildren[key].attr.value += d.value.replace(/^m/, 'M');
								rmNode(childNode);
								tagIndex--;
								i--;
							} else {
								pathChildren[key] = {
									attr: d,
									index: tagIndex,
									node: childNode,
								};
							}
						} else {
							pathChildren[key] = {
								attr: d,
								index: tagIndex,
								node: childNode,
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
