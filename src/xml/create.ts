import { stringify as cssStringify } from 'css';
import { ITagNode, ITextNode } from 'svg-vdom';
import { IDom } from '../../typings/node';
import { shortenTag } from '../style/shorten-tag';

export const createXML = (dom?: IDom | null): string => {
	if (!dom) {
		return '';
	}
	if (dom.stylesheet) {
		const cssText = shortenTag(cssStringify(dom.stylesheet, { compress: true }));
		if (cssText) {
			((dom.styletag as ITagNode).childNodes[0] as ITextNode).textContent = cssText;
		} else {
			(dom.styletag as ITagNode).remove();
		}
	}
	return dom.toString();
};
