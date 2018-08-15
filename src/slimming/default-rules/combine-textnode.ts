import { INode, NodeType } from '../../node/index';
import { regularTag } from '../const/regular-tag';
import { mixWhiteSpace } from '../utils/mix-white-space';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

export const combineTextNode = (dom: INode) => new Promise((resolve, reject) => {

	// 首先移除所有可移除的文本节点，并对文本节点进行冗余空格清理
    traversalNode(node => node.nodeType === NodeType.Text || node.nodeType === NodeType.CDATA, (node: INode) => {
        if (!regularTag[node.parentNode.nodeName] || !regularTag[node.parentNode.nodeName].containTextNode) {
        	rmNode(node);
        } else {
    		node.textContent = mixWhiteSpace(node.textContent);
        }
    }, dom);

    // 合并相邻的同类型节点
    traversalNode(node => regularTag[node.nodeName] && regularTag[node.nodeName].containTextNode, node => {
    	let lastNode = null;
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