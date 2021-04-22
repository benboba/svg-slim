import { IDocument, ITagNode, NodeType } from 'svg-vdom';
import { IAnimateAttr, IMatrixFunc, IRuleOption } from '../../typings';
import { APOS_LEN, APOS_RX, APOS_RY, APOS_X, APOS_Y, DEFAULT_MATRIX_DIGIT } from '../const';
import { geometryProperties, transformAttributes } from '../const/definitions';
import { pureNumOrWithPx, pureNumOrWithPxList } from '../const/syntax';
import { multiply } from '../math/multiply';
import { plus } from '../math/plus';
import { toFixed } from '../math/to-fixed';
import { combineMatrix } from '../matrix/combine';
import { Matrix } from '../matrix/matrix';
import { merge } from '../matrix/merge';
import { parseMatrix } from '../matrix/parse';
import { stringify } from '../matrix/stringify';
import { doCompute } from '../path/do-compute';
import { parsePath } from '../path/parse';
import { stringifyPath } from '../path/stringify';
import { checkTypeSelector } from '../style/check-type-selector';
import { parseStyle } from '../style/parse';
import { stringifyStyle } from '../style/stringify';
import { getShorter } from '../utils/get-shorter';
import { parseNumberList } from '../utils/parse-numberlist';
import { shortenNumber } from '../utils/shorten-number';
import { shortenNumberList } from '../utils/shorten-number-list';
import { checkAnimateAttr, getAnimateAttr } from '../xml/get-animate-attr';
import { getAttr } from '../xml/get-attr';
import { parseStyleTree } from '../xml/parse-style-tree';
import { rmAttrs } from '../xml/rm-attrs';

const SAFE_ROTATE_CORNER = 90;

const fixedMVal = toFixed(DEFAULT_MATRIX_DIGIT);

const applyNumber = (fn: (n1: number, n2: number) => number, s: string, ex: number) => shortenNumber(fn(parseFloat(s), ex));

const applyNumberList = (fn: (n1: number, n2: number) => number, numlist: number[], ex: number) => {
	numlist.forEach((val, index) => {
		numlist[index] = fn(val, ex);
	});
	return shortenNumberList(numlist.map(shortenNumber).join(','));
};

const applyNumberPairs = (fn: (n1: number, n2: number) => [number, number], numlist: number[]) => {
	for (let i = 0; i < numlist.length; i += 2) {
		[numlist[i], numlist[i + 1]] = fn(numlist[i], numlist[i + 1]);
	}
	return shortenNumberList(numlist.map(shortenNumber).join(','));
};

// 检查一个属性是否合理
const checkAttr = (node: ITagNode, attrname: string, val: string) => {
	if (val === '0') {
		// 属性为 0 可以直接移除
		rmAttrs(node, [attrname]);
	} else {
		if (geometryProperties.includes(attrname) && node.hasAttribute('style')) {
			const styleList = parseStyle(node.getAttribute('style') as string);
			const hasStyle = styleList.some(sAttr => {
				if (sAttr.fullname === attrname) {
					sAttr.value = val;
					return true;
				}
				return false;
			});
			if (hasStyle) {
				node.setAttribute('style', stringifyStyle(styleList));
				return;
			}
		}
		node.setAttribute(attrname, val);
	}
};

// 应用
const applyTextTransform = (node: ITagNode, matrix: IMatrixFunc, animateAttrs: IAnimateAttr[]) => {
	// todo 暂不支持 animate
	// text 需要用到 x 和 y，tspan 用到 dx 和 dy
	const attrPrefix = node.nodeName === 'tspan' ? 'd' : '';
	if (matrix.type !== 'translate' || checkAnimateAttr(animateAttrs, `${attrPrefix}x`) || checkAnimateAttr(animateAttrs, `${attrPrefix}y`)) {
		return false;
	}
	// text 具有 tspan 子元素，并且至少一个具有 x 或 y 属性，不执行 transform
	if (node.nodeName === 'text' && node.querySelectorAll('tspan[x],tspan[y]').length) {
		return false;
	}
	const dx = node.getAttribute(`${attrPrefix}x`) || '0';
	const dy = node.getAttribute(`${attrPrefix}y`) || '0';
	// 必须是纯数值列表
	if (pureNumOrWithPxList.test(dx) && pureNumOrWithPxList.test(dy)) {
		const dxs = parseNumberList(dx);
		checkAttr(node, `${attrPrefix}x`, applyNumberList(plus, dxs, matrix.val[0]));
		if (matrix.val[1]) {
			const dys = parseNumberList(dy);
			checkAttr(node, `${attrPrefix}y`, applyNumberList(plus, dys, matrix.val[1]));
		}
		node.removeAttribute('transform');
		return true;
	}
	return false;
};

const applyRectTransform = (node: ITagNode, matrix: IMatrixFunc, animateAttrs: IAnimateAttr[], hasStroke: boolean, hasMarker: boolean) => {
	const x = getAttr(node, 'x', '0');
	const y = getAttr(node, 'y', '0');
	const width = getAttr(node, 'width', '0');
	const height = getAttr(node, 'height', '0');
	let rx = getAttr(node, 'rx', 'auto');
	let ry = getAttr(node, 'ry', 'auto');
	if (rx === 'auto') {
		rx = ry;
	} else if (ry === 'auto') {
		ry = rx;
	}
	if (rx === 'auto') {
		rx = '0';
		ry = '0';
	}
	if (!pureNumOrWithPx.test(x) || !pureNumOrWithPx.test(y) || checkAnimateAttr(animateAttrs, 'x') || checkAnimateAttr(animateAttrs, 'y')) {
		return false;
	}
	if (matrix.type !== 'translate') {
		if (hasMarker) {
			return false;
		}
		if (matrix.type !== 'rotate' && hasStroke) {
			return false;
		}
		if (checkAnimateAttr(animateAttrs, 'width') || checkAnimateAttr(animateAttrs, 'height') || checkAnimateAttr(animateAttrs, 'rx') || checkAnimateAttr(animateAttrs, 'ry')) {
			return false;
		}
		if (!pureNumOrWithPx.test(width) || !pureNumOrWithPx.test(height) || !pureNumOrWithPx.test(rx) || !pureNumOrWithPx.test(ry)) {
			return false;
		}
	}
	switch (matrix.type) {
		case 'translate':
			checkAttr(node, 'x', applyNumber(plus, x, matrix.val[0]));
			checkAttr(node, 'y', applyNumber(plus, y, matrix.val[1] || 0));
			node.removeAttribute('transform');
			return true;
		case 'rotate':
			// 1、没有 marker
			// 2、仅限直角旋转
			if (matrix.val[0] % SAFE_ROTATE_CORNER === 0) {
				let mx = new Matrix();
				if (matrix.val.length === 3) {
					mx = mx.translate(matrix.val[1], matrix.val[2]);
					mx = mx.rotate(matrix.val[0]);
					mx = mx.translate(-matrix.val[1], -matrix.val[2]);
				} else {
					mx = mx.rotate(matrix.val[0]);
				}
				// 获取两个对角坐标
				let _x1 = parseFloat(x);
				let _y1 = parseFloat(y);
				let _x2 = plus(_x1, parseFloat(width));
				let _y2 = plus(_y1, parseFloat(height));
				// 运算
				[_x1, _y1] = [mx.a * _x1 + mx.c * _y1 + mx.e, mx.b * _x1 + mx.d * _y1 + mx.f];
				[_x2, _y2] = [mx.a * _x2 + mx.c * _y2 + mx.e, mx.b * _x2 + mx.d * _y2 + mx.f];
				// 重新生成 x 和 y
				checkAttr(node, 'x', `${fixedMVal(Math.min(_x1, _x2))}`);
				checkAttr(node, 'y', `${fixedMVal(Math.min(_y1, _y2))}`);
				if (Math.abs(matrix.val[0] % (SAFE_ROTATE_CORNER * 2)) === SAFE_ROTATE_CORNER) {
					checkAttr(node, 'width', height);
					checkAttr(node, 'height', width);
					checkAttr(node, 'rx', ry);
					if (rx === ry) {
						rmAttrs(node, ['ry']);
					} else {
						checkAttr(node, 'ry', rx);
					}
				}
				node.removeAttribute('transform');
				return true;
			}
			return false;
		case 'scale': {
			// 1. 没有描边
			// 2. 属性不存在，或者没有百分比的值
			const sx = matrix.val[0];
			const sy = matrix.val.length === 2 ? matrix.val[1] : matrix.val[0];
			checkAttr(node, 'x', applyNumber(multiply, x, sx));
			checkAttr(node, 'y', applyNumber(multiply, y, sy));
			checkAttr(node, 'width', applyNumber(multiply, width, sx));
			checkAttr(node, 'height', applyNumber(multiply, height, sy));
			rx = applyNumber(multiply, rx, sx);
			ry = applyNumber(multiply, ry, sy);
			checkAttr(node, 'rx', rx);
			if (rx === ry) {
				rmAttrs(node, ['ry']);
			} else {
				checkAttr(node, 'ry', ry);
			}
			node.removeAttribute('transform');
			return true;
		}
		case 'matrix':
			if (matrix.val[1] === 0 && matrix.val[2] === 0) {
				// 仅验证缩放 + 平移的情况
				const msx = matrix.val[0];
				const msy = matrix.val[3];
				checkAttr(node, 'x', applyNumber(plus, applyNumber(multiply, x, msx), matrix.val[4]));
				checkAttr(node, 'y', applyNumber(plus, applyNumber(multiply, y, msy), matrix.val[5]));
				checkAttr(node, 'width', applyNumber(multiply, width, msx));
				checkAttr(node, 'height', applyNumber(multiply, height, msy));
				rx = applyNumber(multiply, rx, msx);
				ry = applyNumber(multiply, ry, msy);
				checkAttr(node, 'rx', rx);
				if (rx === ry) {
					rmAttrs(node, ['ry']);
				} else {
					checkAttr(node, 'ry', ry);
				}
				node.removeAttribute('transform');
				return true;
			}
			return false;
		default:
			return false;
	}
};

const applyLineTransform = (node: ITagNode, matrix: IMatrixFunc, animateAttrs: IAnimateAttr[], hasMarker: boolean) => {
	if (checkAnimateAttr(animateAttrs, 'x1') || checkAnimateAttr(animateAttrs, 'y1') || checkAnimateAttr(animateAttrs, 'x2') || checkAnimateAttr(animateAttrs, 'y2')) {
		return false;
	}
	const x1 = node.getAttribute('x1') || '0';
	const y1 = node.getAttribute('y1') || '0';
	const x2 = node.getAttribute('x2') || '0';
	const y2 = node.getAttribute('y2') || '0';
	if (!pureNumOrWithPx.test(x1) || !pureNumOrWithPx.test(y1) || !pureNumOrWithPx.test(x2) || !pureNumOrWithPx.test(y2)) {
		return false;
	}
	switch (matrix.type) {
		case 'translate': {
			const tx = matrix.val[0];
			const ty = matrix.val[1] || 0;
			checkAttr(node, 'x1', applyNumber(plus, x1, tx));
			checkAttr(node, 'y1', applyNumber(plus, y1, ty));
			checkAttr(node, 'x2', applyNumber(plus, x2, tx));
			checkAttr(node, 'y2', applyNumber(plus, y2, ty));
			node.removeAttribute('transform');
			return true;
		}
		case 'rotate': {
			if (hasMarker) {
				return false;
			}
			let mx = new Matrix();
			if (matrix.val.length === 3) {
				mx = mx.translate(matrix.val[1], matrix.val[2]);
				mx = mx.rotate(matrix.val[0]);
				mx = mx.translate(-matrix.val[1], -matrix.val[2]);
			} else {
				mx = mx.rotate(matrix.val[0]);
			}
			const _x1 = parseFloat(x1);
			const _y1 = parseFloat(y1);
			const _x2 = parseFloat(x2);
			const _y2 = parseFloat(y2);
			checkAttr(node, 'x1', `${fixedMVal(mx.a * _x1 + mx.c * _y1 + mx.e)}`);
			checkAttr(node, 'y1', `${fixedMVal(mx.b * _x1 + mx.d * _y1 + mx.f)}`);
			checkAttr(node, 'x2', `${fixedMVal(mx.a * _x2 + mx.c * _y2 + mx.e)}`);
			checkAttr(node, 'y2', `${fixedMVal(mx.b * _x2 + mx.d * _y2 + mx.f)}`);
			node.removeAttribute('transform');
			return true;
		}
		default:
			return false;
	}
};

const applyCircleTransform = (node: ITagNode, matrix: IMatrixFunc, animateAttrs: IAnimateAttr[], hasStroke: boolean, hasMarker: boolean) => {
	if (checkAnimateAttr(animateAttrs, 'cx') || checkAnimateAttr(animateAttrs, 'cy')) {
		return false;
	}
	const cx = getAttr(node, 'cx', '0');
	const cy = getAttr(node, 'cy', '0');
	const r = getAttr(node, 'r', '0');
	if (!pureNumOrWithPx.test(cx) || !pureNumOrWithPx.test(cy)) {
		return false;
	}
	if (matrix.type !== 'translate' && hasMarker) {
		return false;
	}
	switch (matrix.type) {
		case 'translate': {
			const tx = matrix.val[0];
			const ty = matrix.val[1] || 0;
			checkAttr(node, 'cx', applyNumber(plus, cx, tx));
			checkAttr(node, 'cy', applyNumber(plus, cy, ty));
			node.removeAttribute('transform');
			return true;
		}
		case 'rotate': {
			let mx = new Matrix();
			if (matrix.val.length === 3) {
				mx = mx.translate(matrix.val[1], matrix.val[2]);
				mx = mx.rotate(matrix.val[0]);
				mx = mx.translate(-matrix.val[1], -matrix.val[2]);
			} else {
				mx = mx.rotate(matrix.val[0]);
			}
			const _cx = parseFloat(cx);
			const _cy = parseFloat(cy);
			checkAttr(node, 'cx', `${fixedMVal(mx.a * _cx + mx.c * _cy + mx.e)}`);
			checkAttr(node, 'cy', `${fixedMVal(mx.b * _cx + mx.d * _cy + mx.f)}`);
			node.removeAttribute('transform');
			return true;
		}
		case 'scale': {
			if (hasStroke || !pureNumOrWithPx.test(r) || checkAnimateAttr(animateAttrs, 'r')) {
				return false;
			}
			const sx = matrix.val[0];
			const sy = matrix.val.length === 2 ? matrix.val[1] : matrix.val[0];
			if (sx === sy) {
				// 不需要转椭圆的情况不影响
				checkAttr(node, 'cx', applyNumber(multiply, cx, sx));
				checkAttr(node, 'cy', applyNumber(multiply, cy, sy));
				checkAttr(node, 'r', applyNumber(multiply, r, sx));
			} else if (checkTypeSelector(node)) {
				return false;
			} else {
				// 只有未被标签选择器命中才能转成椭圆
				node.nodeName = 'ellipse';
				checkAttr(node, 'cx', applyNumber(multiply, cx, sx));
				checkAttr(node, 'cy', applyNumber(multiply, cy, sy));
				checkAttr(node, 'rx', applyNumber(multiply, r, sx));
				checkAttr(node, 'ry', applyNumber(multiply, r, sy));
				rmAttrs(node, ['r']);
			}
			node.removeAttribute('transform');
			return true;
		}
		case 'matrix':
			if (matrix.val[1] === 0 && matrix.val[2] === 0) {
				if (hasStroke || !pureNumOrWithPx.test(r) || checkAnimateAttr(animateAttrs, 'r')) {
					return false;
				}
				// 仅验证缩放 + 平移的情况
				const msx = matrix.val[0];
				const msy = matrix.val[3];
				if (msx === msy) {
					// 不需要转椭圆的情况不影响
					checkAttr(node, 'cx', applyNumber(plus, applyNumber(multiply, cx, msx), matrix.val[4]));
					checkAttr(node, 'cy', applyNumber(plus, applyNumber(multiply, cy, msy), matrix.val[5]));
					checkAttr(node, 'r', applyNumber(multiply, r, msx));
				} else if (checkTypeSelector(node)) {
					return false;
				} else {
					// 只有未被标签选择器命中才能转成椭圆
					node.nodeName = 'ellipse';
					checkAttr(node, 'cx', applyNumber(plus, applyNumber(multiply, cx, msx), matrix.val[4]));
					checkAttr(node, 'cy', applyNumber(plus, applyNumber(multiply, cy, msy), matrix.val[5]));
					checkAttr(node, 'rx', applyNumber(multiply, r, msx));
					checkAttr(node, 'ry', applyNumber(multiply, r, msy));
					rmAttrs(node, ['r']);
				}
				node.removeAttribute('transform');
				return true;
			}
			return false;
		default:
			return false;
	}
};

const applyEllipseTransform = (node: ITagNode, matrix: IMatrixFunc, animateAttrs: IAnimateAttr[], hasStroke: boolean, hasMarker: boolean) => {
	const cx = getAttr(node, 'cx', '0');
	const cy = getAttr(node, 'cy', '0');
	let rx = getAttr(node, 'rx', 'auto');
	let ry = getAttr(node, 'ry', 'auto');
	if (rx === 'auto') {
		rx = ry;
	} else if (ry === 'auto') {
		ry = rx;
	}
	if (rx === 'auto') {
		rx = '0';
		ry = '0';
	}
	if (!pureNumOrWithPx.test(cx) || !pureNumOrWithPx.test(cy) || checkAnimateAttr(animateAttrs, 'cx') || checkAnimateAttr(animateAttrs, 'cy')) {
		return false;
	}
	if (matrix.type !== 'translate' && hasMarker) {
		return false;
	}
	// 未被标签选择命中才能转圆形
	if (rx === ry && !checkAnimateAttr(animateAttrs, 'rx') && !checkAnimateAttr(animateAttrs, 'ry') && !checkTypeSelector(node)) {
		node.nodeName = 'circle';
		rmAttrs(node, ['rx', 'ry']);
		checkAttr(node, 'r', rx);
		return applyCircleTransform(node, matrix, animateAttrs, hasStroke, hasMarker);
	}
	switch (matrix.type) {
		case 'translate': {
			const tx = matrix.val[0];
			const ty = matrix.val[1] || 0;
			checkAttr(node, 'cx', applyNumber(plus, cx, tx));
			checkAttr(node, 'cy', applyNumber(plus, cy, ty));
			node.removeAttribute('transform');
			return true;
		}
		case 'rotate': {
			// 仅限直角旋转
			if (matrix.val[0] % SAFE_ROTATE_CORNER !== 0) {
				return false;
			}
			let mx = new Matrix();
			if (matrix.val.length === 3) {
				mx = mx.translate(matrix.val[1], matrix.val[2]);
				mx = mx.rotate(matrix.val[0]);
				mx = mx.translate(-matrix.val[1], -matrix.val[2]);
			} else {
				mx = mx.rotate(matrix.val[0]);
			}
			const _cx = parseFloat(cx);
			const _cy = parseFloat(cy);
			// 垂直的情况要交换 rx 和 ry
			if (Math.abs(matrix.val[0] % (SAFE_ROTATE_CORNER * 2)) === SAFE_ROTATE_CORNER) {
				// 如果存在百分比的尺寸，不能交换 rx 和 ry
				// TODO：如果存在动画，暂时不做处理
				if (rx.includes('%') || ry.includes('%') || checkAnimateAttr(animateAttrs, 'rx') || checkAnimateAttr(animateAttrs, 'ry')) {
					return false;
				}
				checkAttr(node, 'rx', ry);
				checkAttr(node, 'ry', rx);
			}
			checkAttr(node, 'cx', `${fixedMVal(mx.a * _cx + mx.c * _cy + mx.e)}`);
			checkAttr(node, 'cy', `${fixedMVal(mx.b * _cx + mx.d * _cy + mx.f)}`);
			node.removeAttribute('transform');
			return true;
		}
		case 'scale': {
			if (hasStroke || !pureNumOrWithPx.test(rx) || !pureNumOrWithPx.test(ry) || checkAnimateAttr(animateAttrs, 'rx') || checkAnimateAttr(animateAttrs, 'ry')) {
				return false;
			}
			const sx = matrix.val[0];
			const sy = matrix.val.length === 2 ? matrix.val[1] : matrix.val[0];
			rx = applyNumber(multiply, rx, sx);
			ry = applyNumber(multiply, ry, sy);
			checkAttr(node, 'cx', applyNumber(multiply, cx, sx));
			checkAttr(node, 'cy', applyNumber(multiply, cy, sy));
			if (rx === ry && !checkTypeSelector(node)) {
				// 转成正圆
				node.nodeName = 'circle';
				rmAttrs(node, ['rx', 'ry']);
				checkAttr(node, 'r', rx);
			} else {
				checkAttr(node, 'rx', rx);
				checkAttr(node, 'ry', ry);
			}
			node.removeAttribute('transform');
			return true;
		}
		case 'matrix':
			if (matrix.val[1] === 0 && matrix.val[2] === 0) {
				if (hasStroke || !pureNumOrWithPx.test(rx) || !pureNumOrWithPx.test(ry) || checkAnimateAttr(animateAttrs, 'rx') || checkAnimateAttr(animateAttrs, 'ry')) {
					return false;
				}
				// 仅验证缩放 + 平移的情况
				const msx = matrix.val[0];
				const msy = matrix.val[3];
				rx = applyNumber(multiply, rx, msx);
				ry = applyNumber(multiply, ry, msy);
				checkAttr(node, 'cx', applyNumber(plus, applyNumber(multiply, cx, msx), matrix.val[4]));
				checkAttr(node, 'cy', applyNumber(plus, applyNumber(multiply, cy, msy), matrix.val[5]));
				if (rx === ry && !checkTypeSelector(node)) {
					// 转成正圆
					node.nodeName = 'circle';
					rmAttrs(node, ['rx', 'ry']);
					checkAttr(node, 'r', rx);
				} else {
					checkAttr(node, 'rx', rx);
					checkAttr(node, 'ry', ry);
				}
				node.removeAttribute('transform');
				return true;
			}
			return false;
		default:
			return false;
	}
};

const applyPolyTransform = (node: ITagNode, matrix: IMatrixFunc, animateAttrs: IAnimateAttr[], hasStroke: boolean, hasMarker: boolean, minStr: string) => {
	if (checkAnimateAttr(animateAttrs, 'points')) {
		return false;
	}

	let pointVal = node.getAttribute('points') || '';
	const points = parseNumberList(pointVal);
	// points 数量必须是偶数
	if (points.length % 2 === 1) {
		points.pop();
		pointVal = shortenNumberList(points.map(shortenNumber).join(','));
		node.setAttribute('points', pointVal);
	}

	if (matrix.type === 'translate') {
		const tx = matrix.val[0];
		const ty = matrix.val[1] || 0;
		const _points = applyNumberPairs((x: number, y: number) => [plus(x, tx), plus(y, ty)], points);
		if (_points.length < pointVal.length + minStr.length) {
			node.setAttribute('points', _points);
			node.removeAttribute('transform');
			return true;
		} else {
			return false;
		}
	}

	if (hasMarker || (matrix.type !== 'rotate' && hasStroke)) {
		return false;
	}

	let mx = new Matrix();

	switch (matrix.type) {
		case 'rotate':
			if (matrix.val.length === 3) {
				mx = mx.translate(matrix.val[1], matrix.val[2]);
				mx = mx.rotate(matrix.val[0]);
				mx = mx.translate(-matrix.val[1], -matrix.val[2]);
			} else {
				mx = mx.rotate(matrix.val[0]);
			}
			break;
		case 'scale':
		case 'skewX':
		case 'skewY':
			mx = mx[matrix.type](...matrix.val as [number, number?]);
			break;
		default:
			mx = new Matrix(...matrix.val);
			break;
	}
	const newPoints = applyNumberPairs(
		(n1: number, n2: number) => [
			fixedMVal(mx.a * n1 + mx.c * n2 + mx.e),
			fixedMVal(mx.b * n1 + mx.d * n2 + mx.f),
		],
		points,
	);
	if (newPoints.length < pointVal.length + minStr.length) {
		node.setAttribute('points', newPoints);
		node.removeAttribute('transform');
		return true;
	} else {
		return false;
	}
};

const applyPathTransform = (node: ITagNode, matrix: IMatrixFunc, animateAttrs: IAnimateAttr[], hasStroke: boolean, hasMarker: boolean, minStr: string) => {
	if (checkAnimateAttr(animateAttrs, 'd')) {
		return false;
	}

	const d = node.getAttribute('d') || '';
	const pathResult = doCompute(parsePath(d));

	if (matrix.type === 'translate') {
		const tx = matrix.val[0];
		const ty = matrix.val[1] || 0;
		pathResult.forEach((subPath, index) => {
			subPath.forEach(pathItem => {
				switch (pathItem.type) {
					case 'm':
						// 第一个移动指令也要执行平移变换
						if (index === 0) {
							pathItem.val[0] = plus(pathItem.val[0], tx);
							pathItem.val[1] = plus(pathItem.val[1], ty);
						}
						break;
					case 'M':
					case 'L':
					case 'C':
					case 'S':
					case 'Q':
					case 'T':
						for (let i = 0; i < pathItem.val.length; i += 2) {
							pathItem.val[i] = plus(pathItem.val[i], tx);
							pathItem.val[i + 1] = plus(pathItem.val[i + 1], ty);
						}
						break;
					case 'H':
						for (let i = 0; i < pathItem.val.length; i++) {
							pathItem.val[i] = plus(pathItem.val[i], tx);
						}
						break;
					case 'V':
						for (let i = 0; i < pathItem.val.length; i++) {
							pathItem.val[i] = plus(pathItem.val[i], ty);
						}
						break;
					case 'A':
						for (let i = 0; i < pathItem.val.length; i += APOS_LEN) {
							pathItem.val[i + APOS_X] = plus(pathItem.val[i + APOS_X], tx);
							pathItem.val[i + APOS_Y] = plus(pathItem.val[i + APOS_Y], ty);
						}
						break;
					default:
						break;
				}
			});
		});
		const _d = stringifyPath(doCompute(pathResult));
		if (_d.length < d.length + minStr.length) {
			node.setAttribute('d', _d);
			node.removeAttribute('transform');
			return true;
		} else {
			return false;
		}
	}

	// 不能有 marker
	if (hasMarker) {
		return false;
	} else if (matrix.type !== 'rotate') {
		// rotate 之外不能有 stroke
		// rotate 和 scale 之外遇到 a 指令会有问题
		if (hasStroke || (matrix.type !== 'scale' && d.toLowerCase().includes('a'))) {
			return false;
		}
	}

	if (matrix.type === 'scale') {
		const sx = matrix.val[0];
		const sy = matrix.val.length === 2 ? matrix.val[1] : matrix.val[0];
		pathResult.forEach(subPath => {
			subPath.forEach(pathItem => {
				switch (pathItem.type.toLowerCase()) {
					case 'm':
					case 'l':
					case 'c':
					case 's':
					case 'q':
					case 't':
						for (let i = 0; i < pathItem.val.length; i += 2) {
							pathItem.val[i] = multiply(pathItem.val[i], sx);
							pathItem.val[i + 1] = multiply(pathItem.val[i + 1], sy);
						}
						break;
					case 'h':
						for (let i = 0; i < pathItem.val.length; i++) {
							pathItem.val[i] = multiply(pathItem.val[i], sx);
						}
						break;
					case 'v':
						for (let i = 0; i < pathItem.val.length; i++) {
							pathItem.val[i] = multiply(pathItem.val[i], sy);
						}
						break;
					case 'a':
						for (let i = 0; i < pathItem.val.length; i += APOS_LEN) {
							pathItem.val[i + APOS_RX] = multiply(pathItem.val[i + APOS_RX], sx);
							pathItem.val[i + APOS_RY] = multiply(pathItem.val[i + APOS_RY], sy);
							pathItem.val[i + APOS_X] = multiply(pathItem.val[i + APOS_X], sx);
							pathItem.val[i + APOS_Y] = multiply(pathItem.val[i + APOS_Y], sy);
						}
						break;
					default:
						break;
				}
			});
		});
		const _d = stringifyPath(doCompute(pathResult));
		if (_d.length < d.length + minStr.length) {
			node.setAttribute('d', _d);
			node.removeAttribute('transform');
			return true;
		} else {
			return false;
		}
	}

	let mx = new Matrix();

	switch (matrix.type) {
		case 'rotate':
			if (matrix.val.length === 3) {
				mx = mx.translate(matrix.val[1], matrix.val[2]);
				mx = mx.rotate(matrix.val[0]);
				mx = mx.translate(-matrix.val[1], -matrix.val[2]);
			} else {
				mx = mx.rotate(matrix.val[0]);
			}
			break;
		case 'skewX':
		case 'skewY':
			mx = mx[matrix.type](matrix.val[0]);
			break;
		default:
			mx = new Matrix(...matrix.val);
			break;
	}

	pathResult.forEach((subPath, index) => {
		subPath.forEach(pathItem => {
			switch (pathItem.type) {
				case 'M':
				case 'L':
				case 'C':
				case 'S':
				case 'Q':
				case 'T':
					for (let i = 0; i < pathItem.val.length; i += 2) {
						[pathItem.val[i], pathItem.val[i + 1]] = [
							fixedMVal(mx.a * pathItem.val[i] + mx.c * pathItem.val[i + 1] + mx.e),
							fixedMVal(mx.b * pathItem.val[i] + mx.d * pathItem.val[i + 1] + mx.f),
						];
					}
					break;
				case 'm':
				case 'l':
				case 'c':
				case 's':
				case 'q':
				case 't':
					for (let i = 0; i < pathItem.val.length; i += 2) {
						[pathItem.val[i], pathItem.val[i + 1]] = [
							fixedMVal(mx.a * pathItem.val[i] + mx.c * pathItem.val[i + 1]),
							fixedMVal(mx.b * pathItem.val[i] + mx.d * pathItem.val[i + 1]),
						];
					}
					// 第一个移动指令也要执行平移变换
					if (pathItem.type === 'm' && index === 0) {
						pathItem.val[0] = fixedMVal(pathItem.val[0] + mx.e);
						pathItem.val[1] = fixedMVal(pathItem.val[1] + mx.f);
					}
					break;
				case 'H': {
					pathItem.type = 'L';
					const HVal = pathItem.val.slice();
					const Hy = pathItem.from[1];
					for (let i = 0; i < HVal.length; i++) {
						pathItem.val[i * 2] = fixedMVal(mx.a * HVal[i] + mx.c * Hy + mx.e);
						pathItem.val[i * 2 + 1] = fixedMVal(mx.b * HVal[i] + mx.d * Hy + mx.f);
					}
					break;
				}
				case 'h': {
					pathItem.type = 'l';
					const hVal = pathItem.val.slice();
					const hy = 0;
					for (let i = 0; i < hVal.length; i++) {
						pathItem.val[i * 2] = fixedMVal(mx.a * hVal[i] + mx.c * hy);
						pathItem.val[i * 2 + 1] = fixedMVal(mx.b * hVal[i] + mx.d * hy);
					}
					break;
				}
				case 'V': {
					pathItem.type = 'L';
					const VVal = pathItem.val.slice();
					const Vx = pathItem.from[0];
					for (let i = 0; i < VVal.length; i++) {
						pathItem.val[i * 2] = fixedMVal(mx.a * Vx + mx.c * VVal[i] + mx.e);
						pathItem.val[i * 2 + 1] = fixedMVal(mx.b * Vx + mx.d * VVal[i] + mx.f);
					}
					break;
				}
				case 'v': {
					pathItem.type = 'l';
					const vVal = pathItem.val.slice();
					const vx = 0;
					for (let i = 0; i < vVal.length; i++) {
						pathItem.val[i * 2] = fixedMVal(mx.a * vx + mx.c * vVal[i]);
						pathItem.val[i * 2 + 1] = fixedMVal(mx.b * vx + mx.d * vVal[i]);
					}
					break;
				}
				default:
					break;
			}
		});
	});
	const newD = stringifyPath(doCompute(pathResult));
	if (newD.length < d.length + minStr.length) {
		node.setAttribute('d', newD);
		node.removeAttribute('transform');
		return true;
	} else {
		return false;
	}
};

const applyTransform = (node: ITagNode, matrix: IMatrixFunc, minStr: string) => {
	const animateAttrs = getAnimateAttr(node);
	// 平移可以直接应用，旋转要判断节点类型，其它变形函数只能在没有描边的时候应用
	const hasStroke = (
		getAttr(node, 'stroke', 'none') !== 'none' || checkAnimateAttr(animateAttrs, 'stroke', val => val !== 'none')
	) && (
		getAttr(node, 'stroke-width', '1') !== '0' || checkAnimateAttr(animateAttrs, 'stroke-width', val => val !== '0')
	);
	// 存在 marker 引用的对象只能进行平移变换
	const hasMarker = getAttr(node, 'marker-start', 'none') !== 'none'
		|| getAttr(node, 'marker-mid', 'none') !== 'none'
		|| getAttr(node, 'marker-end', 'none') !== 'none'
		|| checkAnimateAttr(animateAttrs, 'marker-start', val => val !== 'none')
		|| checkAnimateAttr(animateAttrs, 'marker-mid', val => val !== 'none')
		|| checkAnimateAttr(animateAttrs, 'marker-end', val => val !== 'none');

	switch (node.nodeName) {
		case 'text':
		case 'tspan':
			return applyTextTransform(node, matrix, animateAttrs);
		case 'rect':
			return applyRectTransform(node, matrix, animateAttrs, hasStroke, hasMarker);
		case 'line':
			return applyLineTransform(node, matrix, animateAttrs, hasMarker);
		case 'circle':
			return applyCircleTransform(node, matrix, animateAttrs, hasStroke, hasMarker);
		case 'ellipse':
			return applyEllipseTransform(node, matrix, animateAttrs, hasStroke, hasMarker);
		case 'polyline':
		case 'polygon':
			return applyPolyTransform(node, matrix, animateAttrs, hasStroke, hasMarker, minStr);
		case 'path':
			return applyPathTransform(node, matrix, animateAttrs, hasStroke, hasMarker, minStr);
		default:
			return false;
	}
};

export const combineTransform = async (dom: IDocument, {
	params: {
		trifuncDigit,
		sizeDigit,
		angelDigit,
	}
}: IRuleOption): Promise<void> => new Promise(resolve => {
	parseStyleTree(dom);

	const tagNodes = dom.querySelectorAll(NodeType.Tag) as ITagNode[];
	tagNodes.forEach(node => {
		for (let i = node.attributes.length; i--;) {
			const attr = node.attributes[i];
			if (transformAttributes.includes(attr.name)) {
				const transform: IMatrixFunc[] = [];
				parseMatrix(attr.value.trim()).forEach(mFunc => {
					const lastFunc = transform[transform.length - 1];
					if (transform.length && lastFunc.type === mFunc.type) {
						const mergeFunc = merge(lastFunc, mFunc, trifuncDigit, sizeDigit, angelDigit);
						// 如果合并后为无效变化，则出栈，否则更新合并后的函数
						if (mergeFunc.noEffect) {
							transform.pop();
						} else {
							transform[transform.length - 1] = mergeFunc;
						}
					} else {
						transform.push(mFunc);
					}
				});
				if (transform.length) {
					const matrix = combineMatrix(transform, trifuncDigit, sizeDigit, angelDigit);
					const transformStr = stringify(transform, trifuncDigit, sizeDigit, angelDigit);
					const matrixStr = stringify([matrix], trifuncDigit, sizeDigit, angelDigit);
					const minStr = getShorter(transformStr, matrixStr);
					if (matrix.noEffect) {
						node.removeAttribute(attr.fullname);
						return;
					}
					if (attr.fullname === 'transform') {
						// TODO：进一步分析子元素
						// TODO：暂时只应用 transform 属性
						if (applyTransform(node, matrix, ` ${attr.fullname}="${minStr}"`)) {
							return;
						}
					}
					attr.value = minStr;
				} else {
					node.removeAttribute(attr.fullname);
				}
			}
		}
	});
	resolve();
});
