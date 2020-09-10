import { IDocument, NodeType } from 'svg-vdom';

export const rmComments = async (dom: IDocument): Promise<void> => new Promise(resolve => {
	dom.querySelectorAll(NodeType.Comments).forEach(node => {
		node.remove();
	});
	resolve();
});
