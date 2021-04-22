// 合并属性和样式完全相同的路径
import { IAttr, IDocument, IParentNode, ITagNode } from 'svg-vdom';
import { IRuleOption, TDynamicObj } from '../../typings';
import { ITag } from '../../typings/node';
import { IStyleObj } from '../../typings/style';
import { parseColor } from '../color/parse';
import { regularAttr } from '../const/regular-attr';
import { parseAlpha } from '../math/parse-alpha';
import { hasProp } from '../utils/has-prop';
import { keysToKey } from '../utils/keys-to-key';
import { valueIsEqual } from '../xml/attr-is-equal';
import { getAttr } from '../xml/get-attr';
import { parseStyleTree } from '../xml/parse-style-tree';
// import { doCompute } from '../path/do-compute';
// import { parsePath } from '../path/parse';
// import { plus } from '../math/plus';

interface IPathChildrenItem {
	attr: IAttr;
	index: number;
	node: ITag;
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

// TODO：应该验证样式表命中的情况，且遇到了 :nth-child 的坑
const canbeCombine = (node1: ITag, node2: ITag, combineFill: boolean, combineOpacity: boolean): boolean => {
	// 允许路径合并的条件：
	// 1、所有属性和样式（包括继承样式）相同
	// 2、相邻
	// 3、没有 fill 或 stroke
	// 4、所有可见透明度 ≥ 1
	// 5、不能存在任何子节点
	// 6、不能存在 marker
	// TODO 路径没有相交或包含

	// 不能存在任何子节点
	if (node1.children.length || node2.children.length) {
		return false;
	}

	// 有 marker 引用不能进行合并
	const hasMarker = getAttr(node1, 'marker-start', 'none') !== 'none' || getAttr(node1, 'marker-mid', 'none') !== 'none' || getAttr(node1, 'marker-end', 'none') !== 'none';
	if (hasMarker) {
		return false;
	}

	// 属性必须相同
	if (!attrDiff(node1, node2)) {
		return false;
	}

	const styles1 = node1.styles as IStyleObj;
	const styles2 = node2.styles as IStyleObj;
	// 计算后的样式必须相同
	if (!styleDiff(styles1, styles2)) {
		return false;
	}

	const noOpacity = !hasProp(styles1, 'opacity') || parseAlpha(styles1.opacity.value) === 1;
	const noStrokeOpacity = parseColor(hasProp(styles1, 'stroke') ? styles1.stroke.value : '').a === 1 && (!hasProp(styles1, 'stroke-opacity') || parseAlpha(styles1['stroke-opacity'].value) === 1);
	const noFillOpacity = parseColor(hasProp(styles1, 'fill') ? styles1.fill.value : '').a === 1 && (!hasProp(styles1, 'fill-opacity') || parseAlpha(styles1['fill-opacity'].value) === 1);
	// fill 为空或允许合并
	const noFill = (hasProp(styles1, 'fill') && styles1.fill.value === 'none') || combineFill;
	// 填充规则不能是 evenodd 必须是 nonzero
	const noEvenOdd = !hasProp(styles1, 'fill-rule') || styles1['fill-rule'].value !== 'evenodd';
	// stroke 为空
	const noStroke = (!hasProp(styles1, 'stroke') || styles1.stroke.value === 'none');
	// opacity 大于等于 1 或允许合并
	const withoutOpacity = combineOpacity || (noOpacity && noFillOpacity && noStrokeOpacity);
	return withoutOpacity && (noFill || noStroke) && noEvenOdd/* || noJoin(node1.getAttribute('d'), node2.getAttribute('d'))*/;
};

const attrDiff = (node1: ITagNode, node2: ITagNode) => {
	const obj1: TDynamicObj<string> = {};
	const obj2: TDynamicObj<string> = {};
	let same = true;
	node1.attributes.forEach(({ value, fullname }) => {
		if (fullname !== 'd' && fullname !== 'style') {
			obj1[fullname] = value;
		}
	});
	node2.attributes.forEach(({ value, fullname }) => {
		if (fullname !== 'd' && fullname !== 'style') {
			obj2[fullname] = value;
			const attrDefine = regularAttr[fullname];
			if (!hasProp(obj1, fullname) || !valueIsEqual(attrDefine, value, obj1[fullname])) {
				same = false;
			}
		}
	});
	return same && keysToKey(obj1) === keysToKey(obj2);
};

const styleDiff = (styles1: IStyleObj, styles2: IStyleObj) => {
	let same = true;
	Object.keys(styles1).forEach(key => {
		const attrDefine = regularAttr[key];
		if (!hasProp(styles2, key) || !valueIsEqual(attrDefine, styles1[key].value, styles2[key].value)) {
			same = false;
		}
	});
	return same && keysToKey(styles1) === keysToKey(styles2);
};

export const combinePath = async (dom: IDocument, {
	option: {
		disregardFill,
		disregardOpacity,
	}
}: IRuleOption): Promise<void> => new Promise(resolve => {

	parseStyleTree(dom);
	const pathTags = dom.querySelectorAll('path') as ITagNode[];

	for (let i = pathTags.length - 1; i > 0; i--) {
		const pathItem = pathTags[i];
		const prevItem = pathTags[i - 1];
		const parent = pathItem.parentNode as IParentNode;
		// 两个 path 节点的父节点必须相同
		if (prevItem.parentNode === parent) {
			const siblings = parent.children;
			const index = siblings.indexOf(pathItem);
			const pIndex = siblings.indexOf(prevItem);
			// 两个 path 节点必须相邻，否则跳过
			if (pIndex !== index - 1) {
				break;
			}
			if (canbeCombine(pathItem, prevItem, disregardFill as boolean, disregardOpacity as boolean)) {
				const prevD = prevItem.getAttribute('d') || '';
				const pathD = pathItem.getAttribute('d') || '';

				// 路径拼合时，第一个 m 要转为绝对，否则会有 bug
				prevItem.setAttribute('d', `${prevD}${pathD.replace(/^m/, 'M')}`);
				pathItem.remove();
			}

		}
	}
	resolve();
});
