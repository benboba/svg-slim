import { IPathResultItem } from '../../../typings';
import { minus } from '../math/minus';
import { Vector } from '../math/vector';
import { complex } from './complex';

// 曲线指令转直线指令
export const straighten = (threshold: number, pathArr: IPathResultItem[]): IPathResultItem[] => {
	// 必须逆序执行
	outer: for (let pi = pathArr.length; pi--;) {
		const pathItem = pathArr[pi];
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
		} else if (
			// c/s 指令可以直接直线化
			pathItem.type.toLowerCase() === 'c' || pathItem.type.toLowerCase() === 's'
			||
			// q 指令必须保证后续指令不是 t 指令
			(pathItem.type.toLowerCase() === 'q' && (pi === pathArr.length - 1 || pathArr[pi + 1].type.toLowerCase() !== 't'))
		) {
			const complexItem = complex(pathItem, pathArr[pi - 1]);
			if (complexItem.type.toLowerCase() === complexItem.type) {
				for (let i = 0; i < complexItem.val.length; i += 2) {
					const v = new Vector(complexItem.val[i], complexItem.val[i + 1]);
					if (v.modulo >= threshold) {
						continue outer;
					}
				}
				pathItem.type = 'l';
				// 忽略所有的控制点，直接移动到目标点
				pathItem.val = pathItem.val.slice(pathItem.val.length - 2);
			} else {
				for (let i = 0; i < complexItem.val.length; i += 2) {
					const v = new Vector(minus(complexItem.val[i], complexItem.from[0]), minus(complexItem.val[i + 1], complexItem.from[1]));
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
	return pathArr;
};
