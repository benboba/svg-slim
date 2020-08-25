import { ariaAttributes, eventAttributes } from '../const/definitions';
import { regularAttr } from '../const/regular-attr';
import { regularTag } from '../const/regular-tag';
import { hasProp } from '../utils/has-prop';
import { legalValue } from '../validate/legal-value';
import { attrIsEqual } from '../xml/attr-is-equal';
import { parseStyleTree } from '../xml/parse-style-tree';
import { isTag } from '../xml/is-tag';
import { traversalNode } from '../xml/traversal-node';

// rm-attirbute 不再验证 css 类的属性，只关注该 css 属性是否是 svg 所支持的
export const rmAttribute = async (rule: TRulesConfigItem, dom: INode): Promise<null> => new Promise(resolve => {
	if (rule[0]) {

		const {
			rmDefault,
			keepEvent,
			keepAria,
		} = rule[1] as {
			rmDefault: boolean;
			keepEvent: boolean;
			keepAria: boolean;
		};

		traversalNode<ITagNode>(isTag, node => {
			if (rmDefault) {
				parseStyleTree(dom as ITagNode);
			}

			const tagDefine: IRegularTag = regularTag[node.nodeName];

			// href 和 xlink:href 不能并存，如果并存，应该移除后者
			if (node.hasAttribute('href') && node.hasAttribute('xlink:href')) {
				node.removeAttribute('xlink:href');
			}

			for (let i = node.attributes.length; i--;) {
				const attr = node.attributes[i];
				const attrDefine: IRegularAttr = regularAttr[attr.fullname];
				const value = attr.value.trim();
				if (attrDefine.isUndef) { // 非标准属性
					let isUndef = true;
					if (
						(keepEvent && eventAttributes.includes(attr.fullname)) // 事件属性是否保留
						||
						(keepAria && ariaAttributes.includes(attr.fullname)) // aria 属性是否保留
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
						(!attrDefine.couldBeStyle && !attr.fullname.includes('xmlns') && !tagDefine.ownAttributes.includes(attr.fullname)) // 属性和元素不匹配
						||
						!legalValue(attrDefine, attr, node.nodeName) // 不合法的值
					) {
						node.removeAttribute(attr.fullname);
						continue;
					}
				}

				if (rmDefault) {
					// 如果父元素上有同名的样式类属性，则不能移除和默认值相同的属性
					const parentStyle = (node.parentNode as ITagNode).styles;
					if (attrDefine.inherited && parentStyle && hasProp(parentStyle, attr.fullname)) {
						continue;
					}
					if (attrIsEqual(attrDefine, value, node.nodeName)) {
						node.removeAttribute(attr.fullname);
					}
				}

				// use 元素的宽高不能为负
				if (node.nodeName === 'use') {
					if (attr.fullname === 'width' || attr.fullname === 'height') {
						if (+value < 0) {
							node.removeAttribute(attr.fullname);
						}
					}
				}
			}
		}, dom);
	}
	resolve();
});
