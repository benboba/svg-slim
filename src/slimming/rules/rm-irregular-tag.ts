import { any, both, equals, not, prop } from 'ramda';
import { IRuleOption } from '../../../typings';
import { IDomNode, ITagNode } from '../../../typings/node';
import { regularTag } from '../const/regular-tag';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

export const rmIrregularTag = async (dom: IDomNode, { option: { ignore } }: IRuleOption): Promise<void> => new Promise(resolve => {
	const notIgnore = (node: ITagNode) => not(any(equals(prop('nodeName', node)), ignore as string[]));
	traversalNode(both(isTag, notIgnore), node => {
		if (regularTag[node.nodeName].isUndef) {
			rmNode(node);
		}
	}, dom);
	resolve();
});
