import { IDocument, IParentNode, ITagNode } from 'svg-vdom';
import { regularAttr } from '../const/regular-attr';
import { regularTag } from '../const/regular-tag';
import { parseStyle } from '../style/parse';
import { styleToValue } from '../style/style-to-value';

const mergeTspan = (node: ITagNode, parent: ITagNode) => {
	const nodeStyle = parseStyle(node.getAttribute('style') ?? '');
	for (let i = parent.attributes.length; i--;) {
		const attr = parent.attributes[i];
		if (attr.fullname === 'style') {
			const parentStyle = parseStyle(attr.value);
			for (let pi = parentStyle.length; pi--;) {
				const styleItem = parentStyle[pi];
				const styleDefine = regularAttr[styleItem.fullname];
				// 继承的优先级最低，所以不管子元素具有重名的属性还是 style，都要移除父元素的对应属性
				if (!styleDefine.isUndef && node.hasAttribute(styleItem.fullname)) {
					continue;
				}
				if (nodeStyle.some(({ fullname }) => fullname === styleItem.fullname)) {
					continue;
				}
				nodeStyle.unshift({ ...styleItem });
			}
			node.setAttribute('style', styleToValue(nodeStyle));
		} else {
			const attrDefine = regularAttr[attr.fullname];
			if (!node.hasAttribute(attr.fullname) && !attrDefine.isUndef) {
				node.setAttribute(attr.fullname, attr.value);
			}
		}
	}
	(parent.parentNode as ITagNode).replaceChild(parent.childNodes, parent);
};

export const collapseTextwrap = async (dom: IDocument): Promise<void> => new Promise(resolve => {
	const textWraps = dom.querySelectorAll('tspan') as ITagNode[];

	textWraps.forEach(node => {
		// 只要有一个非空属性，就不执行塌陷
		if (node.attributes.every(({ value }) => !value)) {
			(node.parentNode as IParentNode).replaceChild(node.childNodes, node);
		} else {
			// tspan 嵌套需要把文本节点拿出来放到父元素内
			// 暂时只处理单一子元素的情况，多子元素可能因为复制属性和样式导致“反优化”
			if (node.querySelectorAll('>tspan').length === 1) {
				mergeTspan(node.querySelector('>tspan') as ITagNode, node);
			}
		}
	});
	resolve();
});
