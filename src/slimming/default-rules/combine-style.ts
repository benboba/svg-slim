import { parse as cssParse } from 'css';
import { propEq } from 'ramda';
import { INode, NodeType } from '../../node/index';
import { IDomNode, ITagNode } from '../interface/node';
import { mixWhiteSpace } from '../utils/mix-white-space';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

// 合并多个 style 标签，并将文本节点合并到一个子节点
export const combineStyle = async (dom: IDomNode): Promise<null> => new Promise((resolve, reject) => {
	let firstStyle: ITagNode | undefined;
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
					lastChildNode.textContent += cNode.textContent;
					rmNode(cNode);
					i--;
				}
			}
		}
	};

	traversalNode<ITagNode>(propEq('nodeName', 'style'), node => {
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
		if (childNodes.length === 0 || !childNodes[0].textContent || !childNodes[0].textContent.replace(/\s/g, '')) { // 如果内容为空，则移除style节点
			rmNode(firstStyle);
		} else {
			if (childNodes[0].textContent.indexOf('<') === -1) { // 如果没有危险代码，则由 CDATA 转为普通文本类型
				childNodes[0].nodeType = NodeType.Text;
			}

			// 解析 stylesheet 并缓存
			try {
				const parsedCss = cssParse(childNodes[0].textContent);
				if (parsedCss.stylesheet) {
					dom.stylesheet = parsedCss;
					dom.styletag = firstStyle;
				} else {
					rmNode(firstStyle);
				}
			} catch (e) {
				rmNode(firstStyle);
			}
		}
	}

	resolve();
});
