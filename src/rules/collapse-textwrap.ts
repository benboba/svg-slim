import { IDocument, ITagNode, IParentNode } from 'svg-vdom';
import { regularTag } from '../const/regular-tag';

export const collapseTextwrap = async (dom: IDocument): Promise<void> => new Promise(resolve => {
	const textWraps = dom.querySelectorAll(node => {
		const tagDefine = regularTag[node.nodeName];
		return !!(tagDefine.containTextNode && node.parentNode && regularTag[node.parentNode.nodeName].containTextNode);
	}) as ITagNode[];

	textWraps.forEach(node => {
		// 只要有一个非空属性，就不执行塌陷
		if (node.attributes.every(({ value }) => !value)) {
			(node.parentNode as IParentNode).replaceChild(node.childNodes, node);
		}
	});
	resolve();
});
