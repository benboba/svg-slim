import { IDomNode, ITagNode } from '../../../typings/node';
import { shapeElements } from '../const/definitions';
import { getById } from '../xml/get-by-id';

// 验证 animateMotion 的合法性
export const checkAnimateMotion = (node: ITagNode, dom: IDomNode) => {
	return node.hasAttribute('path')
	||
	node.childNodes.some(subNode => {
		if (subNode.nodeName !== 'mpath') {
			return false;
		}
		const id = subNode.getAttribute('href') || subNode.getAttribute('xlink:href');
		if (!id) {
			return false;
		}
		const target = getById(id, dom);
		if (!target) {
			return false;
		}
		return shapeElements.includes(target.nodeName);
	});
};
