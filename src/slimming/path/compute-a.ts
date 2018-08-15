import { all, eqProps, lt, whereEq } from 'ramda';
import { toFixed } from '../math/tofixed';
import { Vector } from '../math/vector';
import { numberLength } from '../utils/number-length';
import { IPathResultItem } from './exec';

const APOS_RX = 0;
const APOS_RY = 1;
const APOS_ROTATION = 2;
const APOS_LARGE = 3;
const APOS_SWEEP = 4;
export const APOS_X = 5;
export const APOS_Y = 6;
const FROM_CX = 2;
const FROM_CY = 3;
const DIGIT = 3;

const getCenter = (x1: number, y1: number, x2: number, y2: number, r: number, ccw: boolean) => {
	const v = new Vector(x2 - x1, y2 - y1);
	v.modulo = Math.sqrt(r * r - Math.pow(v.modulo / 2, 2));
	const arc = ccw ? -Math.PI / 2 : Math.PI / 2;
	v.rotate(arc);
	const symbol = ccw ? 1 : -1;
	const cx = (x1 + x2) / 2 + symbol * v.x;
	const cy = (y1 + y2) / 2 + symbol * v.y;
	return [toFixed(DIGIT, cx), toFixed(DIGIT, cy)];
};

const combineA = (pathResult, rLen, absolute, center) => {
	if (rLen > 0) {
		const lastItem = pathResult[rLen - 1];
		if (lastItem.type.toLowerCase() === 'a') {
			const _eqProps = prop => eqProps(prop, lastItem.val, absolute);
			if (all(_eqProps, [APOS_RX, APOS_RY, APOS_ROTATION]) && absolute[APOS_RX] === absolute[APOS_RY] && (lastItem.from[0] !== absolute[APOS_X] || lastItem.from[1] !== absolute[APOS_Y])) {
				if (whereEq([lastItem.from[FROM_CX], lastItem.from[FROM_CY]], center)) {
					const vbase = new Vector(lastItem.from[0] - center[0], lastItem.from[1] - center[1]);
					const v1 = new Vector(lastItem.val[APOS_X] - center[0], lastItem.val[APOS_Y] - center[1]);
					const v2 = new Vector(absolute[APOS_X] - center[0], absolute[APOS_Y] - center[1]);
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
					const radian1 = lastItem.val[APOS_LARGE] === 0 ? Vector.radian(vbase, v1) : Math.PI * 2 - Vector.radian(vbase, v1);
					const radian2 = absolute[APOS_LARGE] === 0 ? Vector.radian(v1, v2) : Math.PI * 2 - Vector.radian(v1, v2);
					if (radian1 + radian2 > Math.PI && lastItem.val[APOS_LARGE] === 0) {
						lastItem.val[APOS_LARGE] = 1;
					}
					return true;
				}
			}
		}
	}
	return false;
};

export const computeA = (absolute: number[], relative: number[], pathResult: IPathResultItem[], pos: number[]) => {
	const rLen = pathResult.length;
	const center = getCenter(pos[0], pos[1], absolute[APOS_X], absolute[APOS_Y], absolute[APOS_RX], absolute[APOS_LARGE] === absolute[APOS_SWEEP]);
	const hasCombine = combineA(pathResult, rLen, absolute, center);
	if (!hasCombine) {
		if (lt(numberLength(relative), numberLength(absolute))) {
			pathResult.push({
				type: 'a',
				from: pos.concat(center),
				val: relative.slice()
			});
		} else {
			pathResult.push({
				type: 'A',
				from: pos.concat(center),
				val: absolute.slice()
			});
		}
	}
	return [absolute[APOS_X], absolute[APOS_Y]];
};