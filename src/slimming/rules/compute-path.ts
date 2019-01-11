import { propEq } from 'ramda';
import { INode } from '../../node/index';
import { douglasPeucker } from '../algorithm/douglas-peucker';
import { ConfigItem } from '../config/config';
import { plus } from '../math/plus';
import { doCompute } from '../path/do-compute';
import { execPath, IPathResultItem } from '../path/exec';
import { shortenDigit } from '../path/shorten-digit';
import { stringifyFuncVal } from '../utils/stringify-funcval';
import { traversalNode } from '../xml/traversal-node';
import { ITagNode } from '../interface/node';


const availTypes = 'LlHhVv';

const DPItemNormalize = (pathItem: IPathResultItem): IPathResultItem => {
	switch (pathItem.type) {
		case 'l':
			pathItem.val[0] = plus(pathItem.val[0], pathItem.from[0]);
			pathItem.val[1] = plus(pathItem.val[1], pathItem.from[1]);
			for (let i = 2, l = pathItem.val.length; i < l; i += 2) {
				pathItem.val[i] = plus(pathItem.val[i], pathItem.val[i - 2]);
				pathItem.val[i + 1] = plus(pathItem.val[i + 1], pathItem.val[i - 1]);
			}
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
	for (let i = 0, l = pathArr.length; i < l; i++) {
		const pathItem = pathArr[i];
		if (availTypes.indexOf(pathItem.type) !== -1) {
			const lastItem = pathResult[len - 1];
			if (lastItem.type === 'L') {
				DPItemMerge(lastItem, pathItem);
			} else {
				pathResult.push(DPItemNormalize(pathItem));
				len++;
			}
		} else {
			if (len > 0 && pathResult[len - 1].type === 'L') {
				const lastItem = pathResult[len - 1];
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

const PATH_CONFIG_DIGIT_1 = 3;
const PATH_CONFIG_DIGIT_2 = 4;

export const computePath = async (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		traversalNode<ITagNode>(propEq('nodeName', 'path'), node => {
			const attrD = node.getAttribute('d');

			if (attrD) {
				let pathResult = doCompute(execPath(attrD));

				// 如果存在道格拉斯 - 普克规则，则执行道格拉斯普克算法，之后需要再次更新
				if (rule[1] && rule[2]) {
					pathResult = doCompute(DPInit(rule[2] as number, pathResult));
				}

				// 移除掉末尾无意义的 m 指令
				let len = pathResult.length;
				while (pathResult[len - 1].type.toLowerCase() === 'm') {
					len--;
					pathResult.length = len;
				}

				let d = '';
				pathResult.forEach(pathItem => {
					d += `${pathItem.type}${stringifyFuncVal(shortenDigit(pathItem, rule[PATH_CONFIG_DIGIT_1] as number, rule[PATH_CONFIG_DIGIT_2] as number))}`;
				});
				node.setAttribute('d', d);
			}

		}, dom);
	}
	resolve();
});
