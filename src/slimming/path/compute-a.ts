import { all, eqProps, lt } from 'ramda';
import { APOS_LARGE, APOS_ROTATION, APOS_RX, APOS_RY, APOS_SWEEP, APOS_X, APOS_Y, CIRC } from '../const';
import { toFixed } from '../math/tofixed';
import { Vector } from '../math/vector';
import { numberLength } from '../utils/number-length';

const FROM_CX = 2;
const FROM_CY = 3;
const DIGIT = 3;

const getCenter = (x1: number, y1: number, x2: number, y2: number, rx: number, ry: number, rotation: number, ccw: boolean): number[] => {
	const v1 = new Vector(x1, y1);
	const v2 = new Vector(x2, y2);
	if (rotation) {
		v1.rotate(-rotation * Math.PI * 2 / CIRC);
		v2.rotate(-rotation * Math.PI * 2 / CIRC);
	}
	if (rx !== ry) {
		v1.y *= rx / ry;
		v2.y *= rx / ry;
	}
	const v = new Vector(v2.x - v1.x, v2.y - v1.y);
	v.modulo = Math.sqrt(rx * rx - Math.pow(v.modulo / 2, 2));
	const arc = ccw ? -Math.PI / 2 : Math.PI / 2;
	v.rotate(arc);
	v.x += (v1.x + v2.x) / 2;
	v.y += (v1.y + v2.y) / 2;
	if (rx !== ry) {
		v.y *= ry / rx;
	}
	if (rotation) {
		v.rotate(rotation * Math.PI * 2 / CIRC);
	}
	return [toFixed(DIGIT, v.x), toFixed(DIGIT, v.y)];
};

const combineA = (pathResult: IPathResultItem[], rLen: number, absolute: number[], center: number[]): boolean => {
	const lastItem = pathResult[rLen - 1];
	if (lastItem.type.toLowerCase() === 'a') {
		// rx ry 转角 旋转方向相等，并且圆心重合，才能进行合并
		const _eqProps = (prop: number) => eqProps(`${prop}`, lastItem.val, absolute);
		if (all(_eqProps, [APOS_RX, APOS_RY, APOS_ROTATION, APOS_SWEEP]) && lastItem.from[FROM_CX] === center[0] && lastItem.from[FROM_CY] === center[1]) {
			const vbase = new Vector(lastItem.from[0] - center[0], lastItem.from[1] - center[1]);
			const v1 = new Vector(lastItem.val[APOS_X] - center[0], lastItem.val[APOS_Y] - center[1]);
			if (lastItem.type === 'a') { // 相对弧线不需要减中心点坐标
				v1.x = lastItem.val[APOS_X];
				v1.y = lastItem.val[APOS_Y];
			}
			const v2 = new Vector(absolute[APOS_X] - center[0], absolute[APOS_Y] - center[1]);
			let radian1 = Vector.radian(vbase, v1);
			if (lastItem.val[APOS_LARGE] === 1) {
				radian1 = Math.PI * 2 - radian1;
			}
			let radian2 = Vector.radian(v1, v2);
			if (absolute[APOS_LARGE] === 1) {
				radian2 = Math.PI * 2 - radian2;
			}
			// 超过 360 度不能合并
			if (radian1 + radian2 >= Math.PI * 2) {
				return false;
			}
			const relative = absolute.slice();
			relative[APOS_X] -= lastItem.from[0];
			relative[APOS_Y] -= lastItem.from[1];
			if (lt(numberLength(relative), numberLength(absolute))) {
				lastItem.type = 'a';
				lastItem.val[APOS_X] = relative[APOS_X];
				lastItem.val[APOS_Y] = relative[APOS_Y];
			} else {
				lastItem.type = 'A';
				lastItem.val[APOS_X] = absolute[APOS_X];
				lastItem.val[APOS_Y] = absolute[APOS_Y];
			}
			if (radian1 + radian2 > Math.PI && lastItem.val[APOS_LARGE] === 0) {
				lastItem.val[APOS_LARGE] = 1;
			}
			return true;
		}
	}
	return false;
};

export const computeA = (absolute: number[], relative: number[], pathResult: IPathResultItem[], pos: number[]): number[] => {
	const rLen = pathResult.length;
	const center = getCenter(pos[0], pos[1], absolute[APOS_X], absolute[APOS_Y], absolute[APOS_RX], absolute[APOS_RY], absolute[APOS_ROTATION], absolute[APOS_LARGE] === absolute[APOS_SWEEP]);
	if (!combineA(pathResult, rLen, absolute, center)) {
		const relLen = numberLength(relative);
		const absLen = numberLength(absolute);
		if (relLen === absLen) { // 如果相等则参照前一个指令
			if (pathResult[rLen - 1].type === 'a') {
				pathResult.push({
					type: 'a',
					from: pos.concat(center),
					val: relative.slice(),
				});
			} else {
				pathResult.push({
					type: 'A',
					from: pos.concat(center),
					val: absolute.slice(),
				});
			}
		} else if (relLen < absLen) {
			pathResult.push({
				type: 'a',
				from: pos.concat(center),
				val: relative.slice(),
			});
		} else {
			pathResult.push({
				type: 'A',
				from: pos.concat(center),
				val: absolute.slice(),
			});
		}
	}
	return [absolute[APOS_X], absolute[APOS_Y]];
};
