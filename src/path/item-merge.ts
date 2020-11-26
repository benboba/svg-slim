import { IPathResultItem } from '../../typings';
import { lineNormalize } from './line-normalize';

export const itemMerge = (lastItem: IPathResultItem, pathItem: IPathResultItem): void => {
	lastItem.val = lastItem.val.concat(lineNormalize(pathItem).val);
};
