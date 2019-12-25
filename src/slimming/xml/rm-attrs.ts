import { execStyle } from '../style/exec';
import { stringifyStyle } from '../style/stringify';

export const rmAttrs = (node: ITagNode, attrs: string[]) => {
	let styleVal = execStyle(node.getAttribute('style') || '');
	for (const key of attrs) {
		node.removeAttribute(key);
		styleVal = styleVal.filter(attr => attr.fullname !== key);
	}
	if (styleVal.length) {
		node.setAttribute('style', stringifyStyle(styleVal));
	} else {
		node.removeAttribute('style');
	}
};
