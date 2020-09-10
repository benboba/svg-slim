import { IDocument, NodeType } from 'svg-vdom';

export const rmDocType = async (dom: IDocument): Promise<void> => new Promise(resolve => {
	dom.querySelectorAll(NodeType.DocType).forEach(node => {
		node.remove();
	});
	resolve();
});
