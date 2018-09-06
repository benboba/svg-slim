import { INode } from '../../node/index';
import { ConfigItem } from '../config/config';
import { numberPattern } from '../const/syntax';
import { isTag } from '../xml/is-tag';
import { traversalNode } from '../xml/traversal-node';

const pxReg = new RegExp(`(^|\\(|\\s|,|{|;|:)(${numberPattern})px(?=$|\\)|\\s|,|;|})`, 'gi');

export const rmPx = (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
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
	resolve();
});