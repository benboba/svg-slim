import { symmetry } from '../math/symmetry';
import { plus } from '../math/plus';
import { minus } from '../math/minus';

// 把简单路径指令转回复杂指令
export const complex = (item: IPathResultItem, lastItem: IPathResultItem) => {
	if (item.type.toLowerCase() === 's') {
		let [x, y] = item.from;
		if (lastItem.type === 'C') {
			x = symmetry(lastItem.val[2], item.from[0]);
			y = symmetry(lastItem.val[3], item.from[1]);
		} else if (lastItem.type === 'c') {
			x = symmetry(plus(lastItem.val[2], lastItem.from[0]), item.from[0]);
			y = symmetry(plus(lastItem.val[3], lastItem.from[1]), item.from[1]);
		}
		if (item.type === 'S') {
			item.type = 'C';
			item.val.unshift(x, y);
		} else {
			item.type = 'c';
			item.val.unshift(minus(x, item.from[0]), minus(y, item.from[1]));
		}
	} else if (item.type.toLowerCase() === 't') {
		let [x, y] = item.from;
		if (lastItem.type === 'Q') {
			x = symmetry(lastItem.val[0], item.from[0]);
			y = symmetry(lastItem.val[1], item.from[1]);
		} else  if (lastItem.type === 'q') {
			x = symmetry(plus(lastItem.val[0], lastItem.from[0]), item.from[0]);
			y = symmetry(plus(lastItem.val[1], lastItem.from[1]), item.from[1]);
		}
		if (item.type === 'T') {
			item.type = 'Q';
			item.val.unshift(x, y);
		} else {
			item.type = 'q';
			item.val.unshift(minus(x, item.from[0]), minus(y, item.from[1]));
		}
	}
};
