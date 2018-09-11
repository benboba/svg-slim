import { propEq} from 'ramda';
import { INode } from '../../node/index';
import { douglasPeucker } from '../algorithm/douglas-peucker';
import { minus } from '../math/minus';
import { plus } from '../math/plus';
import { APOS_X, computeA } from '../path/compute-a';
import { computeC } from '../path/compute-c';
import { computeH } from '../path/compute-h';
import { computeL } from '../path/compute-l';
import { computeM } from '../path/compute-m';
import { computeQ } from '../path/compute-q';
import { computeS } from '../path/compute-s';
import { computeT } from '../path/compute-t';
import { computeV } from '../path/compute-v';
import { computeZ } from '../path/compute-z';
import { execPath, IPathItem, IPathResultItem } from '../path/exec';
import { traversalNode } from '../xml/traversal-node';
import { ConfigItem } from '../config/config';
import { stringifyFuncVal } from '../utils/stringify-funcval';

const cArgLen = 6;
const sArgLen = 4;
const qArgLen = 4;
const aArgLen = 7;

const doCompute = (pathArr: IPathItem[]): IPathResultItem[] => {
	const pathResult: IPathResultItem[] = [];
	let pos: number[] = [0, 0];
	pathArr.forEach(pathItem => {
		switch (pathItem.type) {
			// 平移 - 绝对
			case 'M':
				// 移动命令只有最后一组有意义
				const last_M = pathItem.val.length - pathItem.val.length % 2 - 2;
				pos = computeM(pathItem.val, [minus(pathItem.val[last_M], pos[0]), minus(pathItem.val[last_M + 1], pos[1])], pathResult, pos);
				break;
			// 平移 - 相对
			case 'm':
				const last_m = pathItem.val.length - pathItem.val.length % 2 - 2;
				pos = computeM([plus(pathItem.val[last_m], pos[0]), plus(pathItem.val[last_m + 1], pos[1])], pathItem.val, pathResult, pos);
				break;
			case 'Z':
			case 'z':
				pos = computeZ(pathResult, pos);
				break;
			// 水平直线 - 绝对
			case 'H':
				for (let i = 0, l = pathItem.val.length; i < l; i++) {
					pos = computeH(pathItem.val[i], minus(pathItem.val[i], pos[0]), pathResult, pos);
				}
				break;
			// 水平直线 - 相对
			case 'h':
				for (let i = 0, l = pathItem.val.length; i < l; i++) {
					pos = computeH(plus(pathItem.val[i], pos[0]), pathItem.val[i], pathResult, pos);
				}
				break;
			// 垂直直线 - 绝对
			case 'V':
				for (let i = 0, l = pathItem.val.length; i < l; i++) {
					pos = computeV(pathItem.val[i], minus(pathItem.val[i], pos[1]), pathResult, pos);
				}
				break;
			// 垂直直线 - 相对
			case 'v':
				for (let i = 0, l = pathItem.val.length; i < l; i++) {
					pos = computeV(plus(pathItem.val[i], pos[1]), pathItem.val[i], pathResult, pos);
				}
				break;
			// 直线 - 绝对
			case 'L':
				for (let i = 0, l = pathItem.val.length; i < l; i += 2) {
					pos = computeL([pathItem.val[i], pathItem.val[i + 1]], [minus(pathItem.val[i], pos[0]), minus(pathItem.val[i + 1], pos[1])], pathResult, pos);
				}
				break;
			// 直线 - 相对
			case 'l':
				for (let i = 0, l = pathItem.val.length; i < l; i += 2) {
					pos = computeL([plus(pathItem.val[i], pos[0]), plus(pathItem.val[i + 1], pos[1])], [pathItem.val[i], pathItem.val[i + 1]], pathResult, pos);
				}
				break;
			// 三次贝塞尔曲线 - 绝对
			case 'C':
				for (let i = 0, l = pathItem.val.length; i < l; i += cArgLen) {
					const C_args = pathItem.val.slice(i, i + cArgLen);
					pos = computeC(C_args, C_args.map((s, index) => minus(s, pos[index % 2])), pathResult, pos);
				}
				break;
			// 三次贝塞尔曲线 - 相对
			case 'c':
				for (let i = 0, l = pathItem.val.length; i < l; i += cArgLen) {
					const c_args = pathItem.val.slice(i, i + cArgLen);
					pos = computeC(c_args.map((s, index) => plus(s, pos[index % 2])), c_args, pathResult, pos);
				}
				break;
			// 三次连续贝塞尔曲线 - 绝对
			case 'S':
				for (let i = 0, l = pathItem.val.length; i < l; i += sArgLen) {
					const S_args = pathItem.val.slice(i, i + sArgLen);
					pos = computeS(S_args, S_args.map((s, index) => minus(s, pos[index % 2])), pathResult, pos);
				}
				break;
			// 三次连续贝塞尔曲线 - 相对
			case 's':
				for (let i = 0, l = pathItem.val.length; i < l; i += sArgLen) {
					const s_args = pathItem.val.slice(i, i + sArgLen);
					pos = computeS(s_args.map((s, index) => plus(s, pos[index % 2])), s_args, pathResult, pos);
				}
				break;
			// 二次贝塞尔曲线 - 绝对
			case 'Q':
				for (let i = 0, l = pathItem.val.length; i < l; i += qArgLen) {
					const Q_args = pathItem.val.slice(i, i + qArgLen);
					pos = computeQ(Q_args, Q_args.map((s, index) => minus(s, pos[index % 2])), pathResult, pos);
				}
				break;
			// 二次贝塞尔曲线 - 相对
			case 'q':
				for (let i = 0, l = pathItem.val.length; i < l; i += qArgLen) {
					const q_args = pathItem.val.slice(i, i + qArgLen);
					pos = computeQ(q_args.map((s, index) => plus(s, pos[index % 2])), q_args, pathResult, pos);
				}
				break;
			// 二次连续贝塞尔曲线 - 绝对
			case 'T':
				for (let i = 0, l = pathItem.val.length; i < l; i += 2) {
					const T_args = pathItem.val.slice(i, i + 2);
					pos = computeT(T_args, T_args.map((s, index) => minus(s, pos[index % 2])), pathResult, pos);
				}
				break;
			// 二次连续贝塞尔曲线 - 相对
			case 't':
				for (let i = 0, l = pathItem.val.length; i < l; i += 2) {
					const t_args = pathItem.val.slice(i, i + 2);
					pos = computeT(t_args.map((s, index) => plus(s, pos[index % 2])), t_args, pathResult, pos);
				}
				break;
			// 圆弧 - 绝对
			case 'A':
				for (let i = 0, l = pathItem.val.length; i < l; i += aArgLen) {
					const A_args = pathItem.val.slice(i, i + aArgLen);
					pos = computeA(A_args, A_args.map((s, index) => index < APOS_X ? s : minus(s, pos[1 - (index % 2)])), pathResult, pos);
				}
				break;
			// 圆弧 - 相对
			case 'a':
				for (let i = 0, l = pathItem.val.length; i < l; i += aArgLen) {
					const a_args = pathItem.val.slice(i, i + aArgLen);
					pos = computeA(a_args.map((s, index) => index < APOS_X ? s : plus(s, pos[1 - (index % 2)])), a_args, pathResult, pos);
				}
				break;
			default:
				break;
		}
	});
	return pathResult;
};

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

export const computePath = (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		traversalNode(propEq('nodeName', 'path'), (node: INode) => {
			const attrD = node.getAttribute('d');

			if (attrD) {
				const pathArr: IPathItem[] = execPath(attrD);
				let pathResult: IPathResultItem[] = doCompute(pathArr);

				// 如果存在道格拉斯 - 普克规则，则执行道格拉斯普克算法，之后需要再次更新
				if (rule[1] && rule[2]) {
					pathResult = doCompute(DPInit(rule[2] as number, pathResult));
				}

				let d = '';
				pathResult.forEach(pathItem => {
					d += `${pathItem.type}${stringifyFuncVal(pathItem.val)}`;
				});
				node.setAttribute('d', d);
			}

		}, dom);
	}
	resolve();
});