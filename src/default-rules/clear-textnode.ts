import { IDocument, ITextNode, NodeType } from 'svg-vdom';
import { regularTag } from '../const/regular-tag';
import { mixWhiteSpace } from '../utils/mix-white-space';

export const clearTextNode = async (dom: IDocument): Promise<void> => new Promise(resolve => {
	const textNodes = dom.querySelectorAll(node => node.nodeType === NodeType.Text || node.nodeType === NodeType.CDATA) as ITextNode[];

	// 移除所有可移除（父节点不支持文本内容）的文本节点，并对文本节点进行冗余空格清理
	textNodes.forEach(node => {
		const parentName = node.parentNode && node.parentNode.nodeName;
		if (parentName && !regularTag[parentName].containTextNode) {
			node.remove();
		} else {
			node.textContent = mixWhiteSpace(node.textContent);
		}
	});

	resolve();
});
