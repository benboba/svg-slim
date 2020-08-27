import { propEq } from 'ramda';
import { NodeType } from '../../node/index';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

export const rmDocType = async (dom: IDomNode): Promise<void> => new Promise(resolve => {
	traversalNode(propEq('nodeType', NodeType.DocType), rmNode, dom);
	resolve();
});
