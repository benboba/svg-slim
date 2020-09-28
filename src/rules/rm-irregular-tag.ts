import { any, both, equals, not, prop } from 'ramda';
import { IDocument, ITagNode } from 'svg-vdom';
import { IRuleOption } from '../../typings';
import { regularTag } from '../const/regular-tag';
import { isTag } from '../xml/is-tag';

export const rmIrregularTag = async (dom: IDocument, { option: { ignore } }: IRuleOption): Promise<void> => new Promise(resolve => {
	const notIgnore = (node: ITagNode) => not(any(equals(prop('nodeName', node)), ignore as string[]));
	const tags = dom.querySelectorAll(both(isTag, notIgnore)) as ITagNode[];
	tags.forEach(node => {
		if (regularTag[node.nodeName].isUndef) {
			node.remove();
		}
	});
	resolve();
});
