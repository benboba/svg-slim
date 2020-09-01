// 合并属性和样式完全相同的路径
import { has } from 'ramda';
import { IRuleOption } from '../../../typings';
import { IAttr, IDomNode, IStyleObj, ITagNode } from '../../../typings/node';
import { parseColor } from '../color/parse';
import { parseAlpha } from '../math/parse-alpha';
import { hasProp } from '../utils/has-prop';
import { getAttr } from '../xml/get-attr';
import { isTag } from '../xml/is-tag';
// import { doCompute } from '../path/do-compute';
// import { parsePath } from '../path/parse';
import { parseStyleTree } from '../xml/parse-style-tree';
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
// 	const pathItems = doCompute(parsePath(str));
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

const canbeCombine = (node1: ITagNode, node2: ITagNode, attr: IAttr, combineFill: boolean, combineOpacity: boolean): boolean => {
	// 不能存在任何子节点
	if (node1.childNodes.length || node2.childNodes.length) {
		return false;
	}

	// 有 marker 引用不能进行合并
	const hasMarker = getAttr(node1, 'marker-start', 'none') !== 'none' || getAttr(node1, 'marker-mid', 'none') !== 'none' || getAttr(node1, 'marker-end', 'none') !== 'none';
	if (hasMarker) {
		return false;
	}

	const styles = node1.styles as IStyleObj;
	const noOpacity: boolean = !hasProp(styles, 'opacity') || parseAlpha(styles.opacity.value) === 1;
	const noStrokeOpacity: boolean = parseColor(hasProp(styles, 'stroke') ? styles.stroke.value : '').a === 1 && (!hasProp(styles, 'stroke-opacity') || parseAlpha(styles['stroke-opacity'].value) === 1);
	const noFillOpacity: boolean = parseColor(hasProp(styles, 'fill') ? styles.fill.value : '').a === 1 && (!hasProp(styles, 'fill-opacity') || parseAlpha(styles['fill-opacity'].value) === 1);
	// fill 为空
	const noFill: boolean = hasProp(styles, 'fill') && styles.fill.value === 'none' && (combineOpacity || (noOpacity && noStrokeOpacity));
	// 填充规则不能是 evenodd 必须是 nonzero
	const noEvenOdd: boolean = !hasProp(styles, 'fill-rule') || styles['fill-rule'].value !== 'evenodd';
	// stroke 为空
	const noStroke: boolean = (!hasProp(styles, 'stroke') || styles.stroke.value === 'none') && (combineOpacity || (noOpacity && noFillOpacity));
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

export const combinePath = async (dom: IDomNode, {
	option: {
		disregardFill,
		disregardOpacity,
	}
}: IRuleOption): Promise<void> => new Promise(resolve => {

	parseStyleTree(dom);
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
						// 允许路径合并的条件：
						// 1、所有属性和样式（包括继承样式）相同
						// 2、相邻
						// 3、没有 fill 或 stroke
						// 4、所有可见透明度 ≥ 1
						// TODO 路径没有相交或包含
						if (pathChildren[key].index === tagIndex - 1 && canbeCombine(childNode, pathChildren[key].node, d, disregardFill as boolean, disregardOpacity as boolean)) {
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
	resolve();
});
