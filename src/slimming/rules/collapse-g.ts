import { propEq } from 'ramda';
import { INode, IAttr } from '../../node/index';
import { transformAttributes, cantCollapseAttributes } from '../const/definitions';
import { execStyle } from '../style/exec';
import { stringifyStyle } from '../style/stringify';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';
import { ConfigItem } from '../config/config';
import { ISubNode } from '../interface/node';

interface IAttrObj {
	[propName: string]: IAttr;
}

const collapseAttributes = (node1: INode, node2: INode) => {
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
			} else if (attr.fullname === 'style') {
				const style1 = execStyle(attrObj[attr.fullname].value);
				const style2 = execStyle(attr.value);
				// 此处只进行属性合并，不做排重，排重在 shorten-style-attr 里做
				attrObj[attr.fullname].value = stringifyStyle(style2.concat(style1));
			}
		} else {
			node1.setAttribute(attr.name, attr.value, attr.namespace);
			attrObj[attr.fullname] = attr;
		}
	});
};

// 包含某些特定属性，不允许进行合并
const cantCollapse = (node: INode) => node.attributes.filter(attr => cantCollapseAttributes.indexOf(attr.fullname) !== -1).length;

const doCollapse = (dom: INode) => {
	traversalNode(propEq('nodeName', 'g'), (node: INode) => {
		const childNodes = node.childNodes;
		const childTags = childNodes.filter(isTag);
		if (!childTags.length) {
			rmNode(node);
		} else if (!cantCollapse(node)) {
			if (childTags.length === 1) { // 只有一个子节点
				const childNode = childTags[0];
				collapseAttributes(childNode, node);
				(node as ISubNode).parentNode.replaceChild(node, ...childNodes);
			} else if (!node.attributes.length) { // 没有属性
				(node as ISubNode).parentNode.replaceChild(node, ...childNodes);
			}
		}
	}, dom);
};

export const collapseG = (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		doCollapse(dom);
	}
	resolve();
});