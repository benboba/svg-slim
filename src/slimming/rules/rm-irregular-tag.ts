import { any, both, equals, not, prop } from 'ramda';
import { regularTag } from '../const/regular-tag';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

export const rmIrregularTag = async (rule: TFinalConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		const { ignore } = rule[1] as { ignore: string[] };
		const notIgnore = (node: ITagNode) => not(any(equals(prop('nodeName', node)), ignore));
		traversalNode(both(isTag, notIgnore), node => {
			if (regularTag[node.nodeName].isUndef) {
				rmNode(node);
			}
		}, dom);
	}
	resolve();
});
