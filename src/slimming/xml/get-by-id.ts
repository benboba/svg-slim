import { traversalNode } from './traversal-node';

export const getById = (idStr: string, dom: INode): INode | undefined => {
	let result: INode | undefined;
	traversalNode(n => idStr === `#${n.getAttribute('id')}`, n => {
		if (!result) {
			result = n;
		}
	}, dom);
	return result;
};
