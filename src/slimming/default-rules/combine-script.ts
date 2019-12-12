import { propEq } from 'ramda';
import { NodeType } from '../../node/index';
import { mixWhiteSpace } from '../utils/mix-white-space';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

// 合并多个 script 标签，并将内容合并为一个子节点
export const combineScript = async (dom: INode): Promise<null> => new Promise((resolve, reject) => {
	let firstScript: ITagNode | undefined;
	let lastChildNode: INode | undefined;

	const checkCNode = (node: ITagNode) => {
		for (let i = 0; i < node.childNodes.length; i++) {
			const cNode = node.childNodes[i];
			if (cNode.nodeType !== NodeType.Text && cNode.nodeType !== NodeType.CDATA) {
				rmNode(cNode);
				i--;
			} else {
				cNode.textContent = mixWhiteSpace((cNode.textContent as string).trim());
				if (cNode.nodeType === NodeType.Text) {
					cNode.nodeType = NodeType.CDATA;
				}
				if (!lastChildNode) {
					lastChildNode = cNode;
				} else {
					if ((lastChildNode.textContent as string).slice(-1) !== ';') {
						lastChildNode.textContent += ';';
					}
					lastChildNode.textContent += cNode.textContent;
					rmNode(cNode);
					i--;
				}
			}
		}
	};

	traversalNode<ITagNode>(propEq('nodeName', 'script'), node => {
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
		if (childNodes.length === 0 || !childNodes[0].textContent || !childNodes[0].textContent.replace(/\s/g, '')) {
			// 如果内容为空，则移除 script 节点
			rmNode(firstScript);
		} else {
			const textContent = childNodes[0].textContent;
			if (textContent.indexOf('<') === -1) {
				// 如果没有危险代码，则由 CDATA 转为普通文本类型
				childNodes[0].nodeType = NodeType.Text;
			}
			if (textContent.slice(-1) === ';') {
				// 移除尾分号
				childNodes[0].textContent = childNodes[0].textContent.slice(0, -1);
			}

			// 把 script 标签插入到最后
			traversalNode<ITagNode>(propEq('nodeName', 'svg'), node => {
				node.appendChild(firstScript as ITagNode);
			}, dom);
		}
	}

	resolve();
});
