import { propEq } from 'ramda';
import { douglasPeucker } from '../algorithm/douglas-peucker';
import { LineTypes } from '../const';
import { plus } from '../math/plus';
import { checkSubPath } from '../path/check-sub-paths';
import { doCompute } from '../path/do-compute';
import { execPath } from '../path/exec';
import { straighten as straightenPath } from '../path/straighten';
import { stringifyPath } from '../path/stringify';
import { execStyleTree } from '../xml/exec-style-tree';
import { getAttr } from '../xml/get-attr';
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

export const computePath = async (rule: TFinalConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		const {
			thinning,
			sizeDigit,
			angelDigit,
			straighten,
		} = rule[1] as {
			thinning: number;
			sizeDigit: number;
			angelDigit: number;
			straighten: number;
		};
		execStyleTree(dom as IDomNode);
		traversalNode<ITagNode>(propEq('nodeName', 'path'), node => {
			const attrD = node.getAttribute('d');
			if (attrD) {
				// 先运算一次 doCompute，拿到每条指令的 from 坐标
				let pathResult = doCompute(execPath(attrD));

				// 是否存在 marker 引用，没有 marker 可以移除所有空移动指令
				const hasMarker = getAttr(node, 'marker-start', 'none') !== 'none' || getAttr(node, 'marker-mid', 'none') !== 'none' || getAttr(node, 'marker-end', 'none') !== 'none';
				// 是否存在 stroke，没有 stroke 可以移除面积为 0 的子路径
				const hasStroke = getAttr(node, 'stroke', 'none') !== 'none' && getAttr(node, 'stroke-width', '1') !== '0';
				// 是否存在 stroke-linecap，没有 stroke-linecap 可以移除长度为 0 的指令
				const hasStrokeCap = getAttr(node, 'stroke-linecap', 'butt') !== 'butt';
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

				if (!pathResult.length) {
					rmNode(node);
					return;
				}

				node.setAttribute('d', stringifyPath(pathResult, sizeDigit, angelDigit));
			} else {
				rmNode(node);
			}

		}, dom);
	}
	resolve();
});
