import { propEq } from 'ramda';
import { INode, NodeType } from '../../node/index';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

export const rmComments = (rule, dom: INode) => new Promise((resolve, reject) => {
	if (rule[0]) {
    	traversalNode(propEq('nodeType', NodeType.Comments), rmNode, dom);
	}
	resolve();
});