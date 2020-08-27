import { unnecessaryElements } from '../const/definitions';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

export const rmUnnecessary = async (dom: IDomNode, { option: { tags } }: IRuleOption<{ tags: string[] }>): Promise<void> => new Promise(resolve => {
	if (tags.length) {
		traversalNode(node => tags.includes(node.nodeName) && unnecessaryElements.includes(node.nodeName), rmNode, dom);
	}
	resolve();
});
