import { minus } from '../math/minus';
import { plus } from '../math/plus';
import { APOS_X, computeA } from './compute-a';
import { computeC } from './compute-c';
import { computeH } from './compute-h';
import { computeL } from './compute-l';
import { computeM } from './compute-m';
import { computeQ } from './compute-q';
import { computeS } from './compute-s';
import { computeT } from './compute-t';
import { computeV } from './compute-v';
import { computeZ } from './compute-z';
import { IPathItem, IPathResultItem } from './exec';

const cArgLen = 6;
const sArgLen = 4;
const qArgLen = 4;
const aArgLen = 7;

export const doCompute = (pathArr: IPathItem[]): IPathResultItem[] => {
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