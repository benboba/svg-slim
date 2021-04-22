import { IDocument, IParentNode, ITagNode, ITextNode, NodeType } from 'svg-vdom';
import { regularAttr } from '../const/regular-attr';
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
	const index = parent.childNodes.indexOf(node);
	node.appendChild(parent.childNodes.slice(index + 1));
	node.insertBefore(parent.childNodes.slice(0, index), node.childNodes[0]);
	(parent.parentNode as ITagNode).replaceChild(node, parent);
};

export const collapseTextwrap = async (dom: IDocument): Promise<void> => new Promise(resolve => {
	const textWraps = dom.querySelectorAll('tspan') as ITagNode[];

	textWraps.forEach(node => {
		if (node.attributes.every(({ value }) => !value)) {
			// 没有属性，或所有属性为空，可以进行塌陷
			(node.parentNode as IParentNode).replaceChild(node.childNodes, node);
		} else {
			// tspan 嵌套需要把文本节点拿出来放到父元素内
			if (
				// 暂时只处理单一子元素的情况，多子元素可能因为复制属性和样式导致“反优化”
				node.querySelectorAll('>tspan').length === 1
				&&
				// 注意如果存在非空文本节点，不能进行塌陷
				node.childNodes.filter(
					childNode => 
						// text 或 cdata 类型
						(childNode.nodeType === NodeType.Text || childNode.nodeType === NodeType.CDATA)
						&&
						// 内容非空
						(childNode as ITextNode).textContent
				).length === 0
			) {
				mergeTspan(node.querySelector('>tspan') as ITagNode, node);
			}
		}
	});
	resolve();
});
