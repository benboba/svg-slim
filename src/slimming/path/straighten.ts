import { CurveTypes } from '../const';
import { Vector } from '../math/vector';
import { complex } from './complex';
import { minus } from '../math/minus';

// 曲线指令转直线指令
export const straighten = (threshold: number, pathArr: IPathResultItem[]): IPathResultItem[] => {
	outer: for (let pi = 0, l = pathArr.length; pi < l; pi++) {
		const pathItem = pathArr[pi];
		if (CurveTypes.indexOf(pathItem.type) !== -1) {
			if (pathItem.type.toLowerCase() === 'a') {
				let [x, y] = [pathItem.val[5], pathItem.val[6]];
				if (pathItem.type === 'A') {
					x = minus(x, pathItem.from[0]);
					y = minus(y, pathItem.from[1]);
				}
				const v = new Vector(x, y);
				if (pathItem.val[0] * 2 < threshold && pathItem.val[1] * 2 < threshold && v.modulo < threshold) {
					pathItem.type = 'l';
					pathItem.val = [x, y];
				}
			} else {
				const lastItem = pathArr[pi - 1];
				complex(pathItem, lastItem);
				if (pathItem.type.toLowerCase() === pathItem.type) {
					for (let i = 0; i < pathItem.val.length; i += 2) {
						const v = new Vector(pathItem.val[i], pathItem.val[i + 1]);
						if (v.modulo >= threshold) {
							continue outer;
						}
					}
					pathItem.type = 'l';
					// 忽略所有的控制点，直接移动到目标点
					pathItem.val = pathItem.val.slice(pathItem.val.length - 2);
				} else {
					for (let i = 0; i < pathItem.val.length; i += 2) {
						const v = new Vector(minus(pathItem.val[i], pathItem.from[0]), minus(pathItem.val[i + 1], pathItem.from[1]));
						if (v.modulo >= threshold) {
							continue outer;
						}
					}
					pathItem.type = 'L';
					// 忽略所有的控制点，直接移动到目标点
					pathItem.val = pathItem.val.slice(pathItem.val.length - 2);
				}
			}
		}
	}
	return pathArr;
};
