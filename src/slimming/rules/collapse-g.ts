import { propEq } from 'ramda';
import { cantCollapseAttributes, transformAttributes } from '../const/definitions';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

interface IAttrObj {
	[propName: string]: IAttr;
}

const collapseAttributes = (node1: ITagNode, node2: ITagNode) => {
	const attrObj: IAttrObj = {};
	node1.attributes.forEach(attr => {
		attrObj[attr.fullname] = attr;
	});
	node2.attributes.forEach(attr => {
		if (attrObj.hasOwnProperty(attr.fullname)) {
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

const doCollapse = (dom: INode) => {
	traversalNode<ITagNode>(propEq('nodeName', 'g'), node => {
		const childNodes = node.childNodes;
		const childTags = childNodes.filter(isTag);
		if (!childTags.length) {
			rmNode(node);
		} else if (!cantCollapse(node)) {
			if (childTags.length === 1) { // 只有一个子节点
				const childNode = childTags[0];
				collapseAttributes(childNode, node);
				(node.parentNode as INode).replaceChild(node, ...childNodes);
			} else if (!node.attributes.length) { // 没有属性
				(node.parentNode as INode).replaceChild(node, ...childNodes);
			}
		}
	}, dom);
};

export const collapseG = async (rule: TFinalConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		doCollapse(dom);
	}
	resolve();
});
