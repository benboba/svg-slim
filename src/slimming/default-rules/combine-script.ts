import { propEq } from 'ramda';
import { INode, NodeType } from '../../node/index';
import { mixWhiteSpace } from '../utils/mix-white-space';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

// 合并多个 script 标签，并将内容合并为一个子节点
export const combineScript = (dom: INode): Promise<null> => new Promise((resolve, reject) => {
    let firstScript: INode = null;
    let lastChildNode: INode;

    const checkCNode = (node: INode) => {
        for (let i = 0; i < node.childNodes.length; i++) {
            const cNode = node.childNodes[i];
            if (cNode.nodeType !== NodeType.Text && cNode.nodeType !== NodeType.CDATA) {
                rmNode(cNode);
                i--;
            } else {
                cNode.textContent = mixWhiteSpace(cNode.textContent.trim());
                if (cNode.nodeType === NodeType.Text) {
                    cNode.nodeType = NodeType.CDATA;
                }
                if (!lastChildNode) {
                    lastChildNode = cNode;
                } else {
		        	if (lastChildNode.textContent.slice(-1) !== ';') {
		        		lastChildNode.textContent += ';';
		        	}
                    lastChildNode.textContent += cNode.textContent;
                    rmNode(cNode);
                    i--;
                }
            }
        }
    };

    traversalNode(propEq('nodeName', 'script'), (node: INode) => {
        if (firstScript) {
            checkCNode(node);
            rmNode(node);
        } else {
            firstScript = node;
            checkCNode(node);
        }
    }, dom);

    if (firstScript) {
        const childNodes = firstScript.childNodes;
        if (childNodes.length === 0 || !childNodes[0].textContent.replace(/\s/g, '')) {
            // 如果内容为空，则移除style节点
            rmNode(firstScript);
        } else if (childNodes[0].textContent.indexOf('<') === -1) {
            // 如果没有危险代码，则由 CDATA 转为普通文本类型
            childNodes[0].nodeType = NodeType.Text;
        }
    }

    resolve();
});