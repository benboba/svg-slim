import { propEq } from 'ramda';
import { NodeType, INode } from '../../node/index';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';
import { ConfigItem } from '../config/config';

export const rmXMLDecl = async (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		traversalNode(propEq('nodeType', NodeType.XMLDecl), rmNode, dom);
	}
	resolve();
});
