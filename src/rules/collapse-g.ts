import { IAttr, IDocument, IParentNode, ITagNode } from 'svg-vdom';
import { TDynamicObj } from '../../typings';
import { cantCollapseAttributes, transformAttributes } from '../const/definitions';
import { hasProp } from '../utils/has-prop';

type TAttrObj = TDynamicObj<IAttr>;

const collapseAttributes = (node1: ITagNode, node2: ITagNode) => {
	const attrObj: TAttrObj = {};
	node1.attributes.forEach(attr => {
		attrObj[attr.fullname] = attr;
	});
	node2.attributes.forEach(attr => {
		if (hasProp(attrObj, attr.fullname)) {
			if (transformAttributes.includes(attr.fullname)) {
				attrObj[attr.fullname].value = `${attr.value} ${attrObj[attr.fullname].value}`;
			}
		} else {
			node1.setAttribute(attr.name, attr.value, attr.namespace);
			attrObj[attr.fullname] = attr;
		}
	});
};

// 包含某些特定属性，不允许进行塌陷
const cantCollapse = (node: ITagNode) => node.attributes.filter(attr => cantCollapseAttributes.includes(attr.fullname)).length;

export const collapseG = async (dom: IDocument): Promise<void> => new Promise(resolve => {
	const gTags = dom.querySelectorAll('g') as ITagNode[];
	for (let i = gTags.length; i--;) {
		const node = gTags[i];
		const childNodes = node.childNodes;
		if (!childNodes.length) {
			node.remove();
		} else if (!cantCollapse(node)) {
			if (childNodes.length === 1) { // 只有一个子节点
				const childNode = childNodes[0] as ITagNode;
				collapseAttributes(childNode, node);
				(node.parentNode as IParentNode).replaceChild(childNode, node);
			} else if (!node.attributes.length) { // 没有属性
				(node.parentNode as IParentNode).replaceChild(childNodes, node);
			}
		}
	}
	resolve();
});
