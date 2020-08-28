import { IPathResultItem } from 'typings';
import { plus } from '../math/plus';

export const computeZ = (pathResult: IPathResultItem[], pos: number[]): number[] => {
	const rLen = pathResult.length;
	const lastItem = pathResult[rLen - 1];
	// 如果 z 指令紧跟着 z 指令，直接抛弃
	if (lastItem.type.toLowerCase() === 'z') {
		return pos;
	}
	const zpos = (pathResult[0].type === 'm') ? [plus(pathResult[0].val[0], pathResult[0].from[0]), plus(pathResult[0].val[1], pathResult[0].from[1])] : [pathResult[0].val[0], pathResult[0].val[1]];
	pathResult.push({
		type: 'z',
		from: pos.slice(),
		val: [],
	});
	return zpos;
};
