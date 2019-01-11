import { propEq } from 'ramda';
import { traversalNode } from '../xml/traversal-node';
import { INode } from '../../node';
import { ConfigItem } from '../config/config';

export const rmVersion = async (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		traversalNode<INode>(propEq('nodeName', 'svg'), node => {
			node.removeAttribute('version');
		}, dom);
	}
	resolve();
});
