import { propEq } from 'ramda';
import { INode, NodeType } from '../../node/index';
import { mixWhiteSpace } from '../utils/mix-white-space';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

// 合并多个 style 标签，并将文本节点合并到一个子节点
export const combineStyle = (dom: INode) => new Promise((resolve, reject) => {
    let firstStyle: INode;
    let lastChildNode;

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
                    lastChildNode.textContent += cNode.textContent;
                    rmNode(cNode);
                    i--;
                }
            }
        }
    };

    traversalNode(propEq('nodeName', 'style'), (node: INode) => {
        if (firstStyle) {
            checkCNode(node);
            rmNode(node);
        } else {
            firstStyle = node;
            checkCNode(node);
        }
    }, dom);

    if (firstStyle) {
        const childNodes = firstStyle.childNodes;
        if (childNodes.length === 0 || !childNodes[0].textContent.replace(/\s/g, '')) { // 如果内容为空，则移除style节点
            firstStyle.parentNode.removeChild(firstStyle);
        } else if (childNodes[0].textContent.indexOf('<') === -1) { // 如果没有危险代码，则由 CDATA 转为普通文本类型
            childNodes[0].nodeType = NodeType.Text;
        }
    }

    resolve();
});