import { INode } from '../../node/index';
import { equals } from 'ramda';

import { TConfigItem } from '../config/config';
import { animationAttributes, animationElements, ariaAttributes, eventAttributes } from '../const/definitions';
import { IRegularAttr, regularAttr } from '../const/regular-attr';
import { IRegularTag, regularTag } from '../const/regular-tag';
import { ITagNode } from '../interface/node';
import { legalValue } from '../validate/legal-value';
import { execStyleTree } from '../xml/exec-style-tree';
import { isTag } from '../xml/is-tag';
import { traversalNode } from '../xml/traversal-node';
import { exec as execColor } from '../color/exec';
import { execNumberList } from '../utils/exec-numberlist';


const valueIsEqual = (attrDefine: IRegularAttr, value1: string, value2: string): boolean => {
	if (value1 === value2) {
		return true;
	}
	if (attrDefine.maybeColor) {
		const color1 = execColor(value1);
		color1.origin = '';
		const color2 = execColor(value2);
		color2.origin = '';
		if (equals(color1, color2)) {
			return true;
		}
	}
	if (attrDefine.maybeSizeNumber || attrDefine.maybeAccurateNumber) {
		const nums2 = execNumberList(value2);
		if (nums2.length > 0 && equals(execNumberList(value1), nums2)) {
			return true;
		}
	}
	return false;
};

const attrIsEqual = (attrDefine: IRegularAttr, value: string, nodeName: string): boolean => {
	if (typeof attrDefine.initValue === 'string') {
		if (valueIsEqual(attrDefine, value, attrDefine.initValue)) {
			return true;
		}
	} else {
		const initValue = attrDefine.initValue;
		for (let ii = 0, il = initValue.length; ii < il; ii++) {
			if (initValue[ii].tag.indexOf(nodeName) !== -1 && valueIsEqual(attrDefine, value, initValue[ii].val)) {
				return true;
			}
		}
	}
	return false;
};

export const rmAttribute = async (rule: TConfigItem[], dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {

		traversalNode<ITagNode>(isTag, node => {
			const tagDefine: IRegularTag = regularTag[node.nodeName];
			// 先取出来 attributeName 属性
			const attributeName = node.getAttribute('attributeName');
			const attributes = node.attributes;

			for (let i = attributes.length; i--;) {
				const attr = attributes[i];
				const attrDefine: IRegularAttr = regularAttr[attr.fullname];
				const value = attr.value.trim();
				if (attrDefine.isUndef) { // 非标准属性
					let isUndef = true;
					if (
						(rule[2] && eventAttributes.indexOf(attr.fullname) !== -1) // 事件属性是否保留
						||
						(rule[3] && ariaAttributes.indexOf(attr.fullname) !== -1) // aria 属性是否保留
					) {
						isUndef = false;
					}
					if (isUndef) {
						node.removeAttribute(attr.fullname);
						continue;
					}
				} else {
					if (
						!value // 空属性
						||
						(!attrDefine.couldBeStyle && attr.fullname.indexOf('xmlns') === -1 && tagDefine.ownAttributes.indexOf(attr.fullname) === -1) // 属性和元素不匹配
						||
						!legalValue(attrDefine, attr, node.nodeName) // 不合法的值
					) {
						node.removeAttribute(attr.fullname);
						continue;
					}

					// 不能实现动画的属性被动画属性引用)
					if (animationAttributes.indexOf(attr.fullname) !== -1 && animationElements.indexOf(node.nodeName) !== -1 && (!attributeName || !regularAttr[attributeName].animatable)) {
						node.removeAttribute(attr.fullname);
						// 同时移除 attributeName 属性
						node.removeAttribute('attributeName');
						continue;
					}
				}

				if (rule[1]) {
					// TODO：因为需要频繁解析样式树，此处存在性能问题
					if (node.parentNode && node.parentNode.parentNode) {
						execStyleTree(node.parentNode.parentNode as ITagNode);
					} else {
						execStyleTree(dom as ITagNode);
					}
					const parentStyle = (node.parentNode as ITagNode).styles;
					// 如果父元素上有同名的样式类属性，则不能移除和默认值相同的属性
					if (attrDefine.couldBeStyle && parentStyle && parentStyle.hasOwnProperty(attr.fullname)) {
						continue;
					}
					if (attrIsEqual(attrDefine, value, node.nodeName)) {
						node.removeAttribute(attr.fullname);
					}
				}
			}
		}, dom);
	}
	resolve();
});
