import { IDocument, NodeType } from 'svg-vdom';

export const rmXMLDecl = async (dom: IDocument): Promise<void> => new Promise(resolve => {
	dom.querySelectorAll(NodeType.XMLDecl).forEach(node => {
		node.remove();
	});
	resolve();
});
