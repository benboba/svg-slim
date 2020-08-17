import { unnecessaryElements } from '../const/definitions';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

export const rmUnnecessary = async (rule: TFinalConfigItem, dom: INode): Promise<null> => new Promise(resolve => {
	if (rule[0]) {
		const { tags } = rule[1] as { tags: string[] };
		if (tags.length) {
			traversalNode(node => tags.includes(node.nodeName) && unnecessaryElements.includes(node.nodeName), rmNode, dom);
		}
	}
	resolve();
});
