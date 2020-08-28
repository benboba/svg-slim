import { IRuleOption } from 'typings';
import { IDomNode } from 'typings/node';
import { unnecessaryElements } from '../const/definitions';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

export const rmUnnecessary = async (dom: IDomNode, { option }: IRuleOption): Promise<void> => new Promise(resolve => {
	const { tags } = option as { tags: string[] };
	if (tags.length) {
		traversalNode(node => tags.includes(node.nodeName) && unnecessaryElements.includes(node.nodeName), rmNode, dom);
	}
	resolve();
});
