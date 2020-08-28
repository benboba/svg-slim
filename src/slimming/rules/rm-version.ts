import { propEq } from 'ramda';
import { IDomNode, INode } from 'typings/node';
import { traversalNode } from '../xml/traversal-node';

export const rmVersion = async (dom: IDomNode): Promise<void> => new Promise(resolve => {
	traversalNode<INode>(propEq('nodeName', 'svg'), node => {
		node.removeAttribute('version');
	}, dom);
	resolve();
});
