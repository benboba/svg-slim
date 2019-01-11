import { plus } from '../math/plus';
import { IPathResultItem } from './exec';

export const computeZ = (pathResult: IPathResultItem[], pos: number[]): number[] => {
	const rLen = pathResult.length;
	if (rLen > 0) {
		const lastItem = pathResult[rLen - 1];
		// 如果 z 指令紧跟着 z 或 m 指令，直接抛弃
		if (lastItem.type.toLowerCase() !== 'z' && lastItem.type.toLowerCase() !== 'm') {
			let i = rLen - 1;
			let zpos: number[] = [0, 0];
			while (i--) {
				if (pathResult[i].type === 'm') {
					zpos = [plus(pathResult[i].val[0], pathResult[i].from[0]), plus(pathResult[i].val[1], pathResult[i].from[1])];
					break;
				} else if (pathResult[i].type === 'M') {
					zpos = [pathResult[i].val[0], pathResult[i].val[1]];
					break;
				}
			}
			pathResult.push({
				type: 'z',
				from: pos.slice(),
				val: []
			});
			return zpos;
		}
	}
	return pos;
};
