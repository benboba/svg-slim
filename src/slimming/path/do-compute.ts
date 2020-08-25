import { APOS_LEN, APOS_X } from '../const';
import { minus } from '../math/minus';
import { plus } from '../math/plus';
import { computeA } from './compute-a';
import { computeC } from './compute-c';
import { computeH } from './compute-h';
import { computeL } from './compute-l';
import { computeM } from './compute-m';
import { computeQ } from './compute-q';
import { computeS } from './compute-s';
import { computeT } from './compute-t';
import { computeV } from './compute-v';
import { computeZ } from './compute-z';
import { abs2rel, rel2abs } from './translate';

const cArgLen = 6;
const sArgLen = 4;
const qArgLen = 4;

export const doCompute = (pathArr: IPathItem[][]) => {
	const result: IPathResultItem[][] = [];
	let pos: number[] = [0, 0];
	for (const subPath of pathArr) {
		const pathResult: IPathResultItem[] = [];
		for (const pathItem of subPath) {
			switch (pathItem.type) {
				// 平移 - 绝对
				case 'M':
					// 当移动指令超过 2 个时，后续指令按平移处理 - fixed@v1.4.2
					for (let i = 0, l = pathItem.val.length; i < l; i += 2) {
						const handler = (i === 0) ? computeM : computeL;
						pos = handler([pathItem.val[i], pathItem.val[i + 1]], abs2rel([pathItem.val[i], pathItem.val[i + 1]], pos), pathResult, pos);
					}
					break;
				// 平移 - 相对
				case 'm':
					// 当移动指令超过 2 个时，后续指令按平移处理 - fixed@v1.4.2
					for (let i = 0, l = pathItem.val.length; i < l; i += 2) {
						const handler = (i === 0) ? computeM : computeL;
						pos = handler(rel2abs([pathItem.val[i], pathItem.val[i + 1]], pos), [pathItem.val[i], pathItem.val[i + 1]], pathResult, pos);
					}
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
						pos = computeL([pathItem.val[i], pathItem.val[i + 1]], abs2rel([pathItem.val[i], pathItem.val[i + 1]], pos), pathResult, pos);
					}
					break;
				// 直线 - 相对
				case 'l':
					for (let i = 0, l = pathItem.val.length; i < l; i += 2) {
						pos = computeL(rel2abs([pathItem.val[i], pathItem.val[i + 1]], pos), [pathItem.val[i], pathItem.val[i + 1]], pathResult, pos);
					}
					break;
				// 三次贝塞尔曲线 - 绝对
				case 'C':
					for (let i = 0, l = pathItem.val.length; i < l; i += cArgLen) {
						const CArgs = pathItem.val.slice(i, i + cArgLen);
						pos = computeC(CArgs, abs2rel(CArgs, pos), pathResult, pos);
					}
					break;
				// 三次贝塞尔曲线 - 相对
				case 'c':
					for (let i = 0, l = pathItem.val.length; i < l; i += cArgLen) {
						const cArgs = pathItem.val.slice(i, i + cArgLen);
						pos = computeC(rel2abs(cArgs, pos), cArgs, pathResult, pos);
					}
					break;
				// 三次连续贝塞尔曲线 - 绝对
				case 'S':
					for (let i = 0, l = pathItem.val.length; i < l; i += sArgLen) {
						const SArgs = pathItem.val.slice(i, i + sArgLen);
						pos = computeS(SArgs, abs2rel(SArgs, pos), pathResult, pos);
					}
					break;
				// 三次连续贝塞尔曲线 - 相对
				case 's':
					for (let i = 0, l = pathItem.val.length; i < l; i += sArgLen) {
						const sArgs = pathItem.val.slice(i, i + sArgLen);
						pos = computeS(rel2abs(sArgs, pos), sArgs, pathResult, pos);
					}
					break;
				// 二次贝塞尔曲线 - 绝对
				case 'Q':
					for (let i = 0, l = pathItem.val.length; i < l; i += qArgLen) {
						const QArgs = pathItem.val.slice(i, i + qArgLen);
						pos = computeQ(QArgs, abs2rel(QArgs, pos), pathResult, pos);
					}
					break;
				// 二次贝塞尔曲线 - 相对
				case 'q':
					for (let i = 0, l = pathItem.val.length; i < l; i += qArgLen) {
						const qArgs = pathItem.val.slice(i, i + qArgLen);
						pos = computeQ(rel2abs(qArgs, pos), qArgs, pathResult, pos);
					}
					break;
				// 二次连续贝塞尔曲线 - 绝对
				case 'T':
					for (let i = 0, l = pathItem.val.length; i < l; i += 2) {
						const TArgs = pathItem.val.slice(i, i + 2);
						pos = computeT(TArgs, abs2rel(TArgs, pos), pathResult, pos);
					}
					break;
				// 二次连续贝塞尔曲线 - 相对
				case 't':
					for (let i = 0, l = pathItem.val.length; i < l; i += 2) {
						const tArgs = pathItem.val.slice(i, i + 2);
						pos = computeT(rel2abs(tArgs, pos), tArgs, pathResult, pos);
					}
					break;
				// 圆弧 - 绝对
				case 'A':
					for (let i = 0, l = pathItem.val.length; i < l; i += APOS_LEN) {
						const AArgs = pathItem.val.slice(i, i + APOS_LEN);
						pos = computeA(AArgs, AArgs.slice(0, APOS_X).concat(abs2rel(AArgs.slice(APOS_X), pos)), pathResult, pos);
					}
					break;
				// 圆弧 - 相对
				case 'a':
					for (let i = 0, l = pathItem.val.length; i < l; i += APOS_LEN) {
						const aArgs = pathItem.val.slice(i, i + APOS_LEN);
						pos = computeA(aArgs.slice(0, APOS_X).concat(rel2abs(aArgs.slice(APOS_X), pos)), aArgs, pathResult, pos);
					}
					break;
				default:
					pos = computeZ(pathResult, pos);
					break;
			}
		}
		if (pathResult.length) {
			result.push(pathResult);
		}
	}
	return result;
};
