import { propEq } from 'ramda';
import { traversalNode } from '../xml/traversal-node';

export const rmVersion = (rule, dom) => new Promise((resolve, reject) => {
	if (rule[0]) {
		traversalNode(propEq('nodeName', 'svg'), node => {
			node.removeAttribute('version');
		}, dom);
	}
	resolve();
});