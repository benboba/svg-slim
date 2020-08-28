import { INode, ITagNode } from 'typings/node';
import { traversalNode } from './traversal-node';

export const getById = (idStr: string, dom: INode) => {
	let result: ITagNode | undefined;
	traversalNode(n => idStr === `#${n.getAttribute('id')}`, (n: ITagNode) => {
		if (!result) {
			result = n;
		}
	}, dom);
	return result;
};
