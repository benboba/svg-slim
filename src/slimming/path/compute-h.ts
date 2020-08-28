import { IPathResultItem } from 'typings';
import { numberLength } from '../utils/number-length';

export const computeH = (absolute: number, relative: number, pathResult: IPathResultItem[], pos: number[]): number[] => {
	const relLen = numberLength([relative]);
	const absLen = numberLength([absolute]);
	if (relLen === absLen) { // 如果相等则参照前一个指令
		if (pathResult[pathResult.length - 1].type === 'H') {
			pathResult.push({
				type: 'H',
				from: pos.slice(),
				val: [absolute],
			});
		} else {
			pathResult.push({
				type: 'h',
				from: pos.slice(),
				val: [relative],
			});
		}
	} else if (relLen < absLen) {
		pathResult.push({
			type: 'h',
			from: pos.slice(),
			val: [relative],
		});
	} else {
		pathResult.push({
			type: 'H',
			from: pos.slice(),
			val: [absolute],
		});
	}
	return [absolute, pos[1]];
};
