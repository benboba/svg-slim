import { IDocument, ITagNode } from 'svg-vdom';
import { shapeElements } from '../const/definitions';

// 验证 animateMotion 的合法性
export const checkAnimateMotion = (node: ITagNode, dom: IDocument) => {
	if (node.hasAttribute('path')) {
		return true;
	}
	const mpath = node.querySelectorAll('mpath') as ITagNode[];
	return mpath.some(subNode => {
		const id = subNode.getAttribute('href') || subNode.getAttribute('xlink:href');
		if (!id) {
			return false;
		}
		const target = dom.querySelector(id);
		if (!target) {
			return false;
		}
		return shapeElements.includes(target.nodeName);
	});
};
