import { INode } from '../../node/index';
import { ConfigItem } from '../config/config';
import { numberPattern } from '../const/syntax';
import { isTag } from '../xml/is-tag';
import { traversalNode } from '../xml/traversal-node';
import { ITagNode } from '../interface/node';

const pxReg = new RegExp(`(^|\\(|\\s|,|{|;|:)(${numberPattern})px(?=$|\\)|\\s|,|;|})`, 'gi');

export const rmPx = async (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		traversalNode<ITagNode>(isTag, node => {
			node.attributes.forEach(attr => {
				if (pxReg.test(attr.value)) {
					attr.value = attr.value.replace(pxReg, '$1$2');
				}
			});
			if (node.nodeName === 'style') {
				node.childNodes[0].textContent = (node.childNodes[0].textContent as string).replace(pxReg, '$1$2');
			}
		}, dom);
	}
	resolve();
});
