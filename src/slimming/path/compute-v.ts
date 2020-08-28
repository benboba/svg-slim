import { IPathResultItem } from 'typings';
import { numberLength } from '../utils/number-length';

export const computeV = (absolute: number, relative: number, pathResult: IPathResultItem[], pos: number[]): number[] => {
	const relLen = numberLength([relative]);
	const absLen = numberLength([absolute]);
	if (relLen === absLen) { // 如果相等则参照前一个指令
		if (pathResult[pathResult.length - 1].type === 'V') {
			pathResult.push({
				type: 'V',
				from: pos.slice(),
				val: [absolute],
			});
		} else {
			pathResult.push({
				type: 'v',
				from: pos.slice(),
				val: [relative],
			});
		}
	} else if (relLen < absLen) {
		pathResult.push({
			type: 'v',
			from: pos.slice(),
			val: [relative],
		});
	} else {
		pathResult.push({
			type: 'V',
			from: pos.slice(),
			val: [absolute],
		});
	}
	return [pos[0], absolute];
};
