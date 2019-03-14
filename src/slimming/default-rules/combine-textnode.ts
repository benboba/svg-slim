import { INode, NodeType } from '../../node/index';
import { regularTag } from '../const/regular-tag';
import { mixWhiteSpace } from '../utils/mix-white-space';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';
import { ITextNode, ITagNode } from '../interface/node';

export const combineTextNode = async (dom: INode): Promise<null> => new Promise((resolve, reject) => {

	// 首先移除所有可移除的文本节点，并对文本节点进行冗余空格清理
	traversalNode<ITextNode>(node => node.nodeType === NodeType.Text || node.nodeType === NodeType.CDATA, node => {
		const parentName = node.parentNode && node.parentNode.nodeName;
		if (parentName && (regularTag[parentName].isUndef || !regularTag[parentName].containTextNode)) {
			rmNode(node);
		} else {
			node.textContent = mixWhiteSpace(node.textContent);
		}
	}, dom);

	// 合并相邻的同类型节点
	traversalNode<ITagNode>(node => !regularTag[node.nodeName].isUndef && regularTag[node.nodeName].containTextNode, node => {
		let lastNode: INode | undefined;
		for (let i = 0; i < node.childNodes.length; i++) {
			const childNode = node.childNodes[i];
			if (childNode.nodeType === NodeType.Text || childNode.nodeType === NodeType.CDATA) {
				if (lastNode) {
					if (lastNode.nodeType === childNode.nodeType) {
						lastNode.textContent = mixWhiteSpace(`${lastNode.textContent}${childNode.textContent}`);
						rmNode(childNode);
						i--;
					} else {
						lastNode = childNode;
					}
				} else {
					lastNode = childNode;
				}
			}
		}
	}, dom);

	resolve();
});
