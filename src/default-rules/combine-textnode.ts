import { IDocument, IParentNode, ITextNode, NodeType } from 'svg-vdom';
import { mixWhiteSpace } from '../utils/mix-white-space';

export const combineTextNode = async (dom: IDocument): Promise<void> => new Promise(resolve => {
	const textNodes = dom.querySelectorAll(node => node.nodeType === NodeType.Text || node.nodeType === NodeType.CDATA) as ITextNode[];

	// 合并相邻的同类型文本节点
	for (let i = textNodes.length; i--;) {
		const childNode = textNodes[i];
		const parent = childNode.parentNode as IParentNode;
		const index = parent.childNodes.indexOf(childNode);
		if (index > 0) {
			const lastNode = parent.childNodes[index - 1] as ITextNode;
			if (lastNode.nodeType === childNode.nodeType) {
				lastNode.textContent = mixWhiteSpace(`${lastNode.textContent}${childNode.textContent}`);
				childNode.remove();
			}
		}
	}

	resolve();
});
