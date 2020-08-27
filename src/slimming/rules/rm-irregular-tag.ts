import { any, both, equals, not, prop } from 'ramda';
import { regularTag } from '../const/regular-tag';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

export const rmIrregularTag = async (dom: IDomNode, { option: { ignore } }: IRuleOption<{ ignore: string[] }>): Promise<void> => new Promise(resolve => {
	const notIgnore = (node: ITagNode) => not(any(equals(prop('nodeName', node)), ignore));
	traversalNode(both(isTag, notIgnore), node => {
		if (regularTag[node.nodeName].isUndef) {
			rmNode(node);
		}
	}, dom);
	resolve();
});
