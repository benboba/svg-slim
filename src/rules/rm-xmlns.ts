import { IDocument, ITagNode } from 'svg-vdom';
import { hasProp } from '../utils/has-prop';

interface IXmlnsDefineUnit {
	target: ITagNode;
	count: number;
}

interface IXmlnsDefine {
	[propName: string]: IXmlnsDefineUnit;
}

export const rmXMLNS = async (dom: IDocument): Promise<void> => new Promise(resolve => {
	const traversalNode = (node: ITagNode, nsStack: IXmlnsDefine[]) => {
		const xmlnsObj: IXmlnsDefine = {};
		Object.assign(xmlnsObj, nsStack[nsStack.length - 1]);

		// 首先判断节点是否存在命名空间
		if (node.namespace) {
			if (hasProp(xmlnsObj, node.namespace)) {
				xmlnsObj[node.namespace].count++;
			} else {
				node.remove();
				return;
			}
		}

		// 遍历节点属性的命名空间
		for (let i = node.attributes.length; i--;) {
			const attr = node.attributes[i];
			if (attr.namespace === 'xmlns') {
				xmlnsObj[attr.name] = {
					target: node,
					count: 0,
				};
			} else if (attr.namespace) {
				if (hasProp(xmlnsObj, attr.namespace)) {
					xmlnsObj[attr.namespace].count++;
				} else if (attr.fullname !== 'xml:space') { // 避免 xml:space 被意外移除
					node.removeAttribute(attr.fullname);
				}
			}
		}

		// 压栈，并遍历子节点
		nsStack.push(xmlnsObj);
		node.children.forEach(childNode => {
			traversalNode(childNode, nsStack);
		});
		Object.keys(xmlnsObj).forEach(ns => {
			if (xmlnsObj[ns].count === 0 && xmlnsObj[ns].target === node) {
				node.removeAttribute(`xmlns:${ns}`);
			}
		});
		nsStack.pop();
	};

	dom.children.forEach(node => {
		traversalNode(node, [{}]);
	});
	resolve();
});
