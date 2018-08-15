import { INode } from '../../node/index';
import { isTag } from '../xml/is-tag';

export const rmXMLNS = (rule, dom: INode) => new Promise((resolve, reject) => {
	if (rule[0]) {
		const traversalNode = (node: INode, nsStack: any[]) => {
			if (isTag(node)) {
				const xmlnsObj: any = {};
				Object.assign(xmlnsObj, nsStack[nsStack.length - 1]);
				for (let i = node.attributes.length; i--; ) {
					const attr = node.attributes[i];
					if (attr.namespace === 'xmlns') {
						xmlnsObj[attr.name] = {
							target: node,
							count: 0
						};
					} else if (attr.namespace) {
						if (xmlnsObj[attr.namespace]) {
							xmlnsObj[attr.namespace].count++;
						} else {
							node.removeAttribute(attr.fullname);
						}
					}
				}
				nsStack.push(xmlnsObj);
				node.childNodes.forEach(childNode => {
					traversalNode(childNode, nsStack);
				});
				Object.keys(xmlnsObj).forEach(ns => {
					if (xmlnsObj[ns].count === 0) {
						node.removeAttribute(`xmlns:${ns}`);
					}
				});
				nsStack.pop();
			}
		};

		dom.childNodes.forEach(node => {
			traversalNode(node, [{}]);
		});
	}
	resolve();
});