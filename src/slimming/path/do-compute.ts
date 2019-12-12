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
import { APOS_X, APOS_LEN } from '../const';

const cArgLen = 6;
const sArgLen = 4;
const qArgLen = 4;

export const doCompute = (pathArr: IPathItem[]): IPathResultItem[] => {
	const pathResult: IPathResultItem[] = [];
	let pos: number[] = [0, 0];
	// tslint:disable-next-line:cyclomatic-complexity
	pathArr.forEach(pathItem => {
		switch (pathItem.type) {
			// 平移 - 绝对
			case 'M':
				// 当移动指令超过 2 个时，后续指令按平移处理 - fixed@v1.4.2
				for (let i = 0, l = pathItem.val.length; i < l; i += 2) {
					const handler = (i === 0) ? computeM : computeL;
					pos = handler([pathItem.val[i], pathItem.val[i + 1]], [minus(pathItem.val[i], pos[0]), minus(pathItem.val[i + 1], pos[1])], pathResult, pos);
				}
				break;
			// 平移 - 相对
			case 'm':
				// 当移动指令超过 2 个时，后续指令按平移处理 - fixed@v1.4.2
				for (let i = 0, l = pathItem.val.length; i < l; i += 2) {
					const handler = (i === 0) ? computeM : computeL;
					pos = handler([plus(pathItem.val[i], pos[0]), plus(pathItem.val[i + 1], pos[1])], [pathItem.val[i], pathItem.val[i + 1]], pathResult, pos);
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
					const CArgs = pathItem.val.slice(i, i + cArgLen);
					pos = computeC(CArgs, CArgs.map((s, index) => minus(s, pos[index % 2])), pathResult, pos);
				}
				break;
			// 三次贝塞尔曲线 - 相对
			case 'c':
				for (let i = 0, l = pathItem.val.length; i < l; i += cArgLen) {
					const cArgs = pathItem.val.slice(i, i + cArgLen);
					pos = computeC(cArgs.map((s, index) => plus(s, pos[index % 2])), cArgs, pathResult, pos);
				}
				break;
			// 三次连续贝塞尔曲线 - 绝对
			case 'S':
				for (let i = 0, l = pathItem.val.length; i < l; i += sArgLen) {
					const SArgs = pathItem.val.slice(i, i + sArgLen);
					pos = computeS(SArgs, SArgs.map((s, index) => minus(s, pos[index % 2])), pathResult, pos);
				}
				break;
			// 三次连续贝塞尔曲线 - 相对
			case 's':
				for (let i = 0, l = pathItem.val.length; i < l; i += sArgLen) {
					const sArgs = pathItem.val.slice(i, i + sArgLen);
					pos = computeS(sArgs.map((s, index) => plus(s, pos[index % 2])), sArgs, pathResult, pos);
				}
				break;
			// 二次贝塞尔曲线 - 绝对
			case 'Q':
				for (let i = 0, l = pathItem.val.length; i < l; i += qArgLen) {
					const QArgs = pathItem.val.slice(i, i + qArgLen);
					pos = computeQ(QArgs, QArgs.map((s, index) => minus(s, pos[index % 2])), pathResult, pos);
				}
				break;
			// 二次贝塞尔曲线 - 相对
			case 'q':
				for (let i = 0, l = pathItem.val.length; i < l; i += qArgLen) {
					const qArgs = pathItem.val.slice(i, i + qArgLen);
					pos = computeQ(qArgs.map((s, index) => plus(s, pos[index % 2])), qArgs, pathResult, pos);
				}
				break;
			// 二次连续贝塞尔曲线 - 绝对
			case 'T':
				for (let i = 0, l = pathItem.val.length; i < l; i += 2) {
					const TArgs = pathItem.val.slice(i, i + 2);
					pos = computeT(TArgs, TArgs.map((s, index) => minus(s, pos[index % 2])), pathResult, pos);
				}
				break;
			// 二次连续贝塞尔曲线 - 相对
			case 't':
				for (let i = 0, l = pathItem.val.length; i < l; i += 2) {
					const tArgs = pathItem.val.slice(i, i + 2);
					pos = computeT(tArgs.map((s, index) => plus(s, pos[index % 2])), tArgs, pathResult, pos);
				}
				break;
			// 圆弧 - 绝对
			case 'A':
				for (let i = 0, l = pathItem.val.length; i < l; i += APOS_LEN) {
					const AArgs = pathItem.val.slice(i, i + APOS_LEN);
					pos = computeA(AArgs, AArgs.map((s, index) => index < APOS_X ? s : minus(s, pos[1 - (index % 2)])), pathResult, pos);
				}
				break;
			// 圆弧 - 相对
			case 'a':
				for (let i = 0, l = pathItem.val.length; i < l; i += APOS_LEN) {
					const aArgs = pathItem.val.slice(i, i + APOS_LEN);
					pos = computeA(aArgs.map((s, index) => index < APOS_X ? s : plus(s, pos[1 - (index % 2)])), aArgs, pathResult, pos);
				}
				break;
			default:
				pos = computeZ(pathResult, pos);
				break;
		}
	});
	return pathResult;
};
