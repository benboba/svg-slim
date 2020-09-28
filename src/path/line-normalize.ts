import { IPathResultItem } from '../../typings';
import { plus } from '../math/plus';

export const lineNormalize = (pathItem: IPathResultItem) => {
	switch (pathItem.type) {
		case 'l':
			pathItem.val[0] = plus(pathItem.val[0], pathItem.from[0]);
			pathItem.val[1] = plus(pathItem.val[1], pathItem.from[1]);
			break;
		case 'H':
			pathItem.val.push(pathItem.from[1]);
			break;
		case 'h':
			pathItem.val[0] = plus(pathItem.val[0], pathItem.from[0]);
			pathItem.val.push(pathItem.from[1]);
			break;
		case 'V':
			pathItem.val.unshift(pathItem.from[0]);
			break;
		case 'v':
			pathItem.val.unshift(pathItem.from[0]);
			pathItem.val[1] = plus(pathItem.val[1], pathItem.from[1]);
			break;
		default:
			break;
	}
	pathItem.type = 'L';
	return pathItem;
};
