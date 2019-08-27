import { propEq } from 'ramda';
import { IAttr, INode } from '../../node/index';
import { TConfigItem } from '../config/config';
import { cantCollapseAttributes, transformAttributes } from '../const/definitions';
import { ITagNode } from '../interface/node';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

interface IAttrObj {
	[propName: string]: IAttr;
}

const collapseAttributes = (node1: ITagNode, node2: ITagNode) => {
	const attrObj: IAttrObj = {};
	const attributes1 = node1.attributes;
	const attributes2 = node2.attributes;
	attributes1.forEach(attr => {
		attrObj[attr.fullname] = attr;
	});
	attributes2.forEach(attr => {
		if (attrObj.hasOwnProperty(attr.fullname)) {
			if (transformAttributes.indexOf(attr.fullname) !== -1) {
				attrObj[attr.fullname].value = `${attr.value} ${attrObj[attr.fullname].value}`;
			}
		} else {
			node1.setAttribute(attr.name, attr.value, attr.namespace);
			attrObj[attr.fullname] = attr;
		}
	});
};

// 包含某些特定属性，不允许进行合并
const cantCollapse = (node: ITagNode) => node.attributes.filter(attr => cantCollapseAttributes.indexOf(attr.fullname) !== -1).length;

const doCollapse = (dom: INode) => {
	traversalNode<ITagNode>(propEq('nodeName', 'g'), node => {
		const childNodes = node.childNodes;
		const childTags = childNodes.filter(isTag) as ITagNode[];
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

export const collapseG = async (rule: TConfigItem[], dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		doCollapse(dom);
	}
	resolve();
});
