// eslint-disable-next-line @typescript-eslint/no-var-requires
const { stringify } = require('css');
import { ITagNode, ITextNode } from 'svg-vdom';
import { IDom } from '../../typings/node';
import { shortenTag } from '../style/shorten-tag';

export const createXML = (dom?: IDom | null): string => {
	if (!dom) {
		return '';
	}
	if (dom.stylesheet) {
		const cssText = shortenTag(stringify(dom.stylesheet, { compress: true }));
		const styleTag = dom.styletag as ITagNode;
		if (cssText) {
			(styleTag.childNodes[0] as ITextNode).textContent = cssText;
		} else {
			styleTag.remove();
		}
	}
	return dom.toString();
};
