import { IDocument, ITagNode } from 'svg-vdom';

export const rmVersion = async (dom: IDocument): Promise<void> => new Promise(resolve => {
	dom.querySelectorAll('svg').forEach(node => {
		(node as ITagNode).removeAttribute('version');
	});
	resolve();
});
