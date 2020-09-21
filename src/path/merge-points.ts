import { IPathResultItem } from '../../typings';
import { LineTypes } from '../const';
import { plus } from '../math/plus';
import { itemMerge } from './item-merge';
import { lineNormalize } from './line-normalize';

const mergePoint = (threshold: number, vals: number[]) => {
	const result: number[] = [];
	const prev = [vals[0], vals[1]];
	for (let i = 2; i < vals.length; i += 2) {
		const x = vals[i] - prev[0];
		const y = vals[i + 1] - prev[1];
		if (x * x + y * y < threshold * threshold) {
			prev[0] = plus(vals[i], prev[0]) / 2;
			prev[1] = plus(vals[i + 1], prev[1]) / 2;
		} else {
			result.push(prev[0], prev[1]);
			prev[0] = vals[i];
			prev[1] = vals[i + 1];
		}
	}
	result.push(...prev);
	return result;
};

export const mergePoints = (threshold: number, pathArr: IPathResultItem[]) => {
	const pathResult: IPathResultItem[] = [];
	let len = 0;
	for (const pathItem of pathArr) {
		if (LineTypes.includes(pathItem.type)) {
			const lastItem = pathResult[len - 1];
			if (lastItem.type === 'L') {
				itemMerge(lastItem, pathItem);
			} else {
				pathResult.push(lineNormalize(pathItem));
				len++;
			}
		} else {
			const lastItem = pathResult[len - 1];
			if (len > 0 && lastItem.type === 'L') {
				lastItem.val = mergePoint(threshold, lastItem.from.concat(lastItem.val));
			}
			pathResult.push(pathItem);
			len++;
		}
	}
	if (pathResult[len - 1].type === 'L') {
		const lastItem = pathResult[len - 1];
		lastItem.val = mergePoint(threshold, lastItem.from.concat(lastItem.val));
	}
	return pathResult;
};
