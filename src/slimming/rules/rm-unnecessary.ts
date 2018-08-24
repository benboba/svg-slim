import { unnecessaryElements } from '../const/definitions';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';
import { ConfigItem } from '../config/config';
import { INode } from '../../node';

export const rmUnnecessary = (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0] && Array.isArray(rule[1]) && (rule[1] as string[]).length) {
		traversalNode(node => (rule[1] as string[]).indexOf(node.nodeName) !== -1 && unnecessaryElements.indexOf(node.nodeName) !== -1, rmNode, dom);
	}
	resolve();
});