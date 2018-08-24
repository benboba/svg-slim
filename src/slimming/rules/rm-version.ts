import { propEq } from 'ramda';
import { traversalNode } from '../xml/traversal-node';
import { INode } from '../../node';
import { ConfigItem } from '../config/config';

export const rmVersion = (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		traversalNode(propEq('nodeName', 'svg'), node => {
			node.removeAttribute('version');
		}, dom);
	}
	resolve();
});