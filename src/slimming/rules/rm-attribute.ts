import { INode } from '../../node/index';
import { animationAttributes, ariaAttributes, eventAttributes } from '../const/definitions';
import { IRegularAttr, regularAttr } from '../const/regular-attr';
import { IRegularTag, regularTag } from '../const/regular-tag';
import { legalValue } from '../validate/legal-value';
import { isTag } from '../xml/is-tag';
import { traversalNode } from '../xml/traversal-node';
import { ConfigItem } from '../config/config';
import { ITagNode } from '../interface/node';

export const rmAttribute = async (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
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
				}
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
				if (animationAttributes.indexOf(attr.fullname) !== -1 && (!attributeName || !regularAttr[attributeName].animatable)) {
					node.removeAttribute(attr.fullname);
					// 同时移除 attributeName 属性
					node.removeAttribute('attributeName');
					continue;
				}

				if (rule[1]) {
					if (typeof attrDefine.initValue === 'string') {
						if (value === attrDefine.initValue) {
							node.removeAttribute('attributeName');
						}
					} else {
						const initValue = attrDefine.initValue as { val: string; tag: string[]}[];
						for (let ii = 0, il = initValue.length; ii < il; ii++) {
							if (initValue[ii].tag.indexOf(node.nodeName) !== -1 && initValue[ii].val === value) {
								node.removeAttribute('attributeName');
							}
						}
					}
				}
			}
		}, dom);
	}
	resolve();
});
