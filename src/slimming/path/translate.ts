import { IPathResultItem } from '../../../typings';
import { minus } from '../math/minus';
import { plus } from '../math/plus';

export const rel2abs = (val: number[], pos: number[]) => val.map((s, index) => plus(s, pos[index % 2]));

export const abs2rel = (val: number[], pos: number[]) => val.map((s, index) => minus(s, pos[index % 2]));

export const getRelHV = (pathItem: IPathResultItem) => {
	const isRel = pathItem.type === pathItem.type.toLowerCase();
	if (isRel) return pathItem.val[0];
	const isH = pathItem.type.toLowerCase() === 'h';
	return minus(pathItem.val[0], pathItem.from[isH ? 0 : 1]);
};

export const getAbsHV = (pathItem: IPathResultItem) => {
	const isAbs = pathItem.type === pathItem.type.toUpperCase();
	if (isAbs) return pathItem.val[0];
	const isH = pathItem.type.toLowerCase() === 'h';
	return plus(pathItem.val[0], pathItem.from[isH ? 0 : 1]);
};

export const getRel = (pathItem: IPathResultItem) => pathItem.type === pathItem.type.toLowerCase() ? pathItem.val.slice() : abs2rel(pathItem.val, pathItem.from);

export const getAbs = (pathItem: IPathResultItem) => pathItem.type === pathItem.type.toUpperCase() ? pathItem.val.slice() : rel2abs(pathItem.val, pathItem.from);
