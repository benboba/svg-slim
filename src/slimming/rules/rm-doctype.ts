import { propEq } from 'ramda';
import { INode, NodeType } from '../../node/index';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

export const rmDocType = (rule, dom: INode) => new Promise((resolve, reject) => {
	if (rule[0]) {
    	traversalNode(propEq('nodeType', NodeType.DocType), rmNode, dom);
	}
	resolve();
});