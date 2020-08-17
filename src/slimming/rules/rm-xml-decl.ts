import { propEq } from 'ramda';
import { NodeType } from '../../node/index';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

export const rmXMLDecl = async (rule: TFinalConfigItem, dom: INode): Promise<null> => new Promise(resolve => {
	if (rule[0]) {
		traversalNode(propEq('nodeType', NodeType.XMLDecl), rmNode, dom);
	}
	resolve();
});
