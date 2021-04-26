import { ITagNode } from 'svg-vdom';
import { parseStyle } from '../style/parse';
import { stringifyStyle } from '../style/stringify';

export const rmAttrs = (node: ITagNode, attrs: string[]) => {
	let styleList = parseStyle(node.getAttribute('style') || '');
	for (const key of attrs) {
		node.removeAttribute(key);
		styleList = styleList.filter(attr => attr.fullname !== key);
	}
	if (styleList.length) {
		node.setAttribute('style', stringifyStyle(styleList));
	} else {
		node.removeAttribute('style');
	}
};
