import { all, eqProps } from 'ramda';
import { IPathResultItem } from '../../../typings';
import { APOS_LARGE, APOS_ROTATION, APOS_RX, APOS_RY, APOS_SWEEP, APOS_X, APOS_Y, CIRC } from '../const';
import { plus } from '../math/plus';
import { toFixed } from '../math/to-fixed';
import { Vector } from '../math/vector';
import { getAbs, getAbsHV, getRel, getRelHV } from './translate';

export const combineHV = (subPath: IPathResultItem[], pathItem: IPathResultItem, index: number) => {
	const relVal = getRelHV(pathItem);
	// 如果前一个函数也是水平/垂直移动，判断是否可以合并
	// 判断的依据是：相对值的积为正数（即同向移动）
	if (subPath[index - 1].type.toLowerCase() === pathItem.type.toLowerCase()) {
		const lastItem: IPathResultItem = subPath[index - 1];
		if (getRelHV(lastItem) * relVal >= 0) {
			// 合并时直接转绝对坐标
			lastItem.val[0] = getAbsHV(pathItem);
			lastItem.type = lastItem.type.toUpperCase();
			subPath.splice(index, 1);
		}
	}
};

// 同方向的直线直接合并
export const combineL = (subPath: IPathResultItem[], pathItem: IPathResultItem, index: number, digit: number) => {
	const fixed = toFixed(digit);
	if (subPath[index - 1].type.toLowerCase() === 'l') {
		const lastItem = subPath[index - 1];
		const relVal = getRel(pathItem);
		const lastRelVal = getRel(lastItem);
		if (fixed(Math.atan2(lastRelVal[0], lastRelVal[1])) === fixed(Math.atan2(relVal[0], relVal[1]))) {
			lastItem.val = [plus(lastItem.val[0], relVal[0]), plus(lastItem.val[1], relVal[1])];
			lastItem.type = 'l';
			subPath.splice(index, 1);
		}
	}
};

const getCenter = (pathItem: IPathResultItem, digit: number): number[] => {
	const rotation = pathItem.val[APOS_ROTATION];
	const rx = pathItem.val[APOS_RX];
	const ry = pathItem.val[APOS_RY];
	const ccw = pathItem.val[APOS_LARGE] === pathItem.val[APOS_SWEEP];
	const abs = getAbs({
		type: pathItem.type,
		val: pathItem.val.slice(APOS_X),
		from: pathItem.from,
	});
	const v1 = new Vector(pathItem.from[0], pathItem.from[1]);
	const v2 = new Vector(abs[0], abs[1]);

	// 先旋转一下
	if (rotation) {
		v1.rotate(-rotation * Math.PI * 2 / CIRC);
		v2.rotate(-rotation * Math.PI * 2 / CIRC);
	}

	// 从椭圆变成正圆
	if (rx !== ry) {
		v1.y *= rx / ry;
		v2.y *= rx / ry;
	}

	// 获取起点到终点的向量
	const v = new Vector(v2.x - v1.x, v2.y - v1.y);

	// r 不一定是够长，需要扩大到指定的大小 https://www.w3.org/TR/SVG/paths.html#ArcOutOfRangeParameters
	let r = rx;
	if (r < v.modulo / 2) {
		r = v.modulo / 2;
	}

	// 向量长度为另一条直角边
	v.modulo = Math.sqrt(r * r - Math.pow(v.modulo / 2, 2));

	// 根据方向选择 90 度
	const arc = ccw ? -Math.PI / 2 : Math.PI / 2;
	v.rotate(arc);

	// 把起始点挪到线段中心
	v.x += (v1.x + v2.x) / 2;
	v.y += (v1.y + v2.y) / 2;
	if (rx !== ry) {
		v.y *= ry / rx;
	}
	if (rotation) {
		v.rotate(rotation * Math.PI * 2 / CIRC);
	}
	return [toFixed(digit, v.x), toFixed(digit, v.y)];
};

export const combineA = (subPath: IPathResultItem[], pathItem: IPathResultItem, index: number, digit: number) => {
	const lastItem = subPath[index - 1];
	if (lastItem.type.toLowerCase() === 'a') {
		// rx ry 转角 旋转方向相等，并且圆心重合，才能进行合并
		const _eqProps = (prop: number) => eqProps(`${prop}`, lastItem.val, pathItem.val);
		if (all(_eqProps, [APOS_RX, APOS_RY, APOS_ROTATION, APOS_SWEEP])) {
			const center = getCenter(pathItem, digit);
			const lastCenter = getCenter(lastItem, digit);
			// equals 存在 0 !== -0 的问题
			if (center[0] === lastCenter[0] && center[1] === lastCenter[1]) {
				// 前一个指令的起始弧线
				const vbase = new Vector(lastItem.from[0] - center[0], lastItem.from[1] - center[1]);

				const lastAbs = getAbs({
					type: lastItem.type,
					val: lastItem.val.slice(APOS_X),
					from: lastItem.from,
				});
				const v1 = new Vector(lastAbs[0] - center[0], lastAbs[1] - center[1]);

				const abs = getAbs({
					type: pathItem.type,
					val: pathItem.val.slice(APOS_X),
					from: pathItem.from,
				});
				const v2 = new Vector(abs[0] - center[0], abs[1] - center[1]);
				let radian1 = Vector.radian(vbase, v1);
				if (lastItem.val[APOS_LARGE] === 1) {
					radian1 = Math.PI * 2 - radian1;
				}
				let radian2 = Vector.radian(v1, v2);
				if (pathItem.val[APOS_LARGE] === 1) {
					radian2 = Math.PI * 2 - radian2;
				}

				// 大于等于 360 度不能合并，等于 360 度会造成 a 指令被忽略
				if (radian1 + radian2 >= Math.PI * 2) {
					return;
				}

				// 下面是进行合并的算法
				// 首先判断是否要改为大转角
				if (radian1 + radian2 > Math.PI && lastItem.val[APOS_LARGE] === 0) {
					lastItem.val[APOS_LARGE] = 1;
				}
				// 直接强制改为绝对坐标
				lastItem.type = 'A';
				lastItem.val[APOS_X] = abs[0];
				lastItem.val[APOS_Y] = abs[1];

				// 移除当前节点
				subPath.splice(index, 1);
			}
		}
	}
	return;
};
