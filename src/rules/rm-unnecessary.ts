import { IDocument } from 'svg-vdom';
import { IRuleOption } from '../../typings';
import { unnecessaryElements } from '../const/definitions';

export const rmUnnecessary = async (dom: IDocument, { option }: IRuleOption): Promise<void> => new Promise(resolve => {
	const { tags } = option as { tags: string[] };
	if (tags.length) {
		dom.querySelectorAll(node => tags.includes(node.nodeName) && unnecessaryElements.includes(node.nodeName)).forEach(node => {
			node.remove();
		});
	}
	resolve();
});
