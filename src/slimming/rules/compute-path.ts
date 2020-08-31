import { anyPass, propEq } from 'ramda';
import { IParamsOption, IPathResultItem, IRuleOption } from 'typings';
import { IDomNode, ITagNode } from 'typings/node';
import { douglasPeucker } from '../algorithm/douglas-peucker';
import { LineTypes } from '../const';
import { plus } from '../math/plus';
import { checkSubPath } from '../path/check-sub-paths';
import { doCompute } from '../path/do-compute';
import { parsePath } from '../path/parse';
import { straighten as straightenPath } from '../path/straighten';
import { stringifyPath } from '../path/stringify';
import { checkAnimateAttr, findAnimateAttr, getAnimateAttr } from '../xml/get-animate-attr';
import { getAttr } from '../xml/get-attr';
import { parseStyleTree } from '../xml/parse-style-tree';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

const DPItemNormalize = (pathItem: IPathResultItem): IPathResultItem => {
	switch (pathItem.type) {
		case 'l':
			pathItem.val[0] = plus(pathItem.val[0], pathItem.from[0]);
			pathItem.val[1] = plus(pathItem.val[1], pathItem.from[1]);
			break;
		case 'H':
			pathItem.val.push(pathItem.from[1]);
			break;
		case 'h':
			pathItem.val[0] = plus(pathItem.val[0], pathItem.from[0]);
			pathItem.val.push(pathItem.from[1]);
			break;
		case 'V':
			pathItem.val.unshift(pathItem.from[0]);
			break;
		case 'v':
			pathItem.val.unshift(pathItem.from[0]);
			pathItem.val[1] = plus(pathItem.val[1], pathItem.from[1]);
			break;
		default:
			break;
	}
	pathItem.type = 'L';
	return pathItem;
};

const DPItemMerge = (lastItem: IPathResultItem, pathItem: IPathResultItem): void => {
	lastItem.val = lastItem.val.concat(DPItemNormalize(pathItem).val);
};

const DPInit = (threshold: number, pathArr: IPathResultItem[]): IPathResultItem[] => {
	const pathResult: IPathResultItem[] = [];
	let len = 0;
	for (const pathItem of pathArr) {
		if (LineTypes.includes(pathItem.type)) {
			const lastItem = pathResult[len - 1];
			if (lastItem.type === 'L') {
				DPItemMerge(lastItem, pathItem);
			} else {
				pathResult.push(DPItemNormalize(pathItem));
				len++;
			}
		} else {
			const lastItem = pathResult[len - 1];
			if (len > 0 && lastItem.type === 'L') {
				lastItem.val = douglasPeucker(threshold, lastItem.from.concat(lastItem.val)).slice(2);
			}
			pathResult.push(pathItem);
			len++;
		}
	}
	if (pathResult[len - 1].type === 'L') {
		const lastItem = pathResult[len - 1];
		lastItem.val = douglasPeucker(threshold, lastItem.from.concat(lastItem.val)).slice(2);
	}
	return pathResult;
};

const processPath = (dVal: string, hasMarker: boolean, hasStroke: boolean, hasStrokeCap: boolean, {
	thinning,
	sizeDigit,
	angelDigit,
	straighten,
}: IParamsOption) => {
	// 先运算一次 doCompute，拿到每条指令的 from 坐标
	let pathResult = doCompute(parsePath(dVal));

	// 如果存在 marker 引用，多余的优化都不能做
	if (!hasMarker) {
		// 存在小尺寸曲线转直线的规则
		if (straighten) {
			// doCompute 必须执行
			pathResult = doCompute(pathResult.map(p => straightenPath(straighten, p)));
		}
		// 存在路径抽稀规则
		if (thinning) {
			// doCompute 必须执行
			pathResult = doCompute(pathResult.map(p => DPInit(thinning, p)));
		}
		// 进行合并、指令转换等运算
		pathResult = doCompute(checkSubPath(pathResult, hasStroke, hasStrokeCap, sizeDigit, angelDigit));
	}
	if (pathResult.length) {
		return stringifyPath(pathResult, sizeDigit, angelDigit);
	} else {
		return '';
	}
};

export const computePath = async (dom: IDomNode, {
	params,
	env,
	option,
}: IRuleOption): Promise<void> => new Promise(resolve => {
	parseStyleTree(dom);
	traversalNode<ITagNode>(anyPass([propEq('nodeName', 'path'), propEq('nodeName', 'animateMotion'), propEq('nodeName', 'textPath')]), node => {
		const attrName = node.nodeName === 'path' ? 'd' : 'path';
		const attrD = node.getAttribute(attrName);
		const animateAttrs = getAnimateAttr(node);

		// 是否存在 marker 引用，没有 marker 可以移除所有空移动指令
		const hasMarker = getAttr(node, 'marker-start', 'none') !== 'none' || getAttr(node, 'marker-mid', 'none') !== 'none' || getAttr(node, 'marker-end', 'none') !== 'none';
		// 是否存在 stroke，没有 stroke 可以移除面积为 0 的子路径
		const hasStroke = getAttr(node, 'stroke', 'none') !== 'none' && getAttr(node, 'stroke-width', '1') !== '0';
		// 是否存在 stroke-linecap，没有 stroke-linecap 可以移除长度为 0 的指令
		const hasStrokeCap = getAttr(node, 'stroke-linecap', 'butt') !== 'butt';
		let noAttrD = true;
		let noAnimateD = true;
		if (attrD) {
			const pathResult = processPath(attrD, hasMarker, hasStroke, hasStrokeCap, params);
			if (!pathResult) {
				node.removeAttribute(attrName);
			} else {
				noAttrD = false;
				node.setAttribute(attrName, pathResult);
			}
		}

		// animateMotion 的 path 属性不能再次被动画元素修改
		if (node.nodeName !== 'animateMotion' && checkAnimateAttr(animateAttrs, attrName)) {
			const animateD = findAnimateAttr(animateAttrs, attrName);
			animateD.forEach(item => {
				const value = item.values.map(val => processPath(val, hasMarker, hasStroke, hasStrokeCap, params));
				item.keys.forEach((key, index) => {
					if (key === 'values') {
						const values = value.slice(index).filter(v => !!v).join(';');
						if (values) {
							item.node.setAttribute(key, values);
						} else {
							item.node.removeAttribute(key);
						}
					} else {
						if (value[index]) {
							item.node.setAttribute(key, value[index]);
						} else {
							item.node.removeAttribute(key);
						}
					}
				});
			});

			// 再次更新动画属性再进行判断
			if (node.nodeName === 'path' && checkAnimateAttr(getAnimateAttr(node), attrName)) {
				noAnimateD = false;
			}
		}

		// 既没有 d 属性也没有动画 d 属性的 path 元素可以移除
		// textPath 不适用，还需要判断 href 和 xlink:href 且 href 指向了正确的目标
		// animateMotion 不适用，还需要判断是否有 mpath 子元素，且 mpath 指向了正确的目标
		if (noAttrD && noAnimateD && node.nodeName === 'path') {
			rmNode(node);
		}

	}, dom);
	resolve();
});
