import { INode } from '../../node/index';
import { isTag } from '../xml/is-tag';
import { traversalNode } from '../xml/traversal-node';

const pxReg = /(^|\(|\s|,|{|;|:)([+-]?\d+(?:\.\d+)?(?:e[+-]?\d+)?)px(?=$|\)|\s|,|;|})/g;

export const rmPx = (rule, dom: INode) => {
	if (rule[0]) {
		traversalNode(isTag, (node: INode) => {
			node.attributes.forEach(attr => {
				if (pxReg.test(attr.value)) {
					attr.value = attr.value.replace(pxReg, '$1$2');
				}
			});
			if (node.nodeName === 'style') {
				node.childNodes[0].textContent = node.childNodes[0].textContent.replace(pxReg, '$1$2');
			}
		}, dom);
	}
};