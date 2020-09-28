import { ITagNode, ITextNode, NodeType } from 'svg-vdom';
import { mixWhiteSpace } from '../utils/mix-white-space';

export const combineText = (node: ITagNode, isScript = false) => {
	let lastChild: ITextNode | undefined;
	for (let i = node.childNodes.length; i--;) {
		const cNode = node.childNodes[i] as ITextNode;
		if (cNode.nodeType !== NodeType.Text && cNode.nodeType !== NodeType.CDATA) {
			cNode.remove();
		} else {
			let text = mixWhiteSpace((cNode.textContent as string).trim());
			if (cNode.nodeType === NodeType.Text) {
				cNode.nodeType = NodeType.CDATA;
			}
			if (!lastChild) {
				lastChild = cNode;
			} else {
				if (isScript && text.slice(-1) !== ';') {
					text += ';';
				}
				lastChild.textContent = `${text}${lastChild.textContent}`.trim();
				cNode.remove();
			}
		}
	}
};
