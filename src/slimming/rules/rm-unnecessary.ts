import { unnecessaryElements } from '../const/definitions';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

export const rmUnnecessary = (rule, dom) => new Promise((resolve, reject) => {
	if (rule[0] && Array.isArray(rule[1]) && rule[1].length) {
		traversalNode(node => rule[1].indexOf(node.nodeName) !== -1 && unnecessaryElements.indexOf(node.nodeName) !== -1, rmNode, dom);
	}
	resolve();
});