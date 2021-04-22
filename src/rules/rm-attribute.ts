import { IDocument, NodeType } from 'svg-vdom';
import { IRegularAttr, IRegularTag, IRuleOption } from '../../typings';
import { ITag } from '../../typings/node';
import { ariaAttributes, eventAttributes } from '../const/definitions';
import { regularAttr } from '../const/regular-attr';
import { regularTag } from '../const/regular-tag';
import { hasProp } from '../utils/has-prop';
import { legalValue } from '../validate/legal-value';
import { attrIsEqual } from '../xml/attr-is-equal';
import { parseStyleTree } from '../xml/parse-style-tree';

// rm-attirbute 不再验证 css 类的属性，只关注该 css 属性是否是 svg 所支持的
export const rmAttribute = async (dom: IDocument, {
	option: {
		keepEvent,
		keepAria,
	},
	params: {
		rmAttrEqDefault,
	},
}: IRuleOption): Promise<void> => new Promise(resolve => {
	const tags = dom.querySelectorAll(NodeType.Tag) as ITag[];
	tags.forEach(node => {
		const tagDefine: IRegularTag = regularTag[node.nodeName];

		// href 和 xlink:href 不能并存，如果并存，应该移除后者
		if (node.hasAttribute('href') && node.hasAttribute('xlink:href')) {
			node.removeAttribute('xlink:href');
		}

		for (let i = node.attributes.length; i--;) {
			const attr = node.attributes[i];
			const attrDefine: IRegularAttr = regularAttr[attr.fullname];
			const value = attr.value;
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

			if (rmAttrEqDefault) {
				// 需要判断 parentNode.styles，而 parentNode.styles 可能在之前被修改过，因此必须在每个 tag 被遍历到的时候重新解析，虽然这有点影响性能…… TODO 设法优化一下？
				parseStyleTree(dom);
				if (attrDefine.couldBeStyle && (!tagDefine.onlyAttr || !tagDefine.onlyAttr.includes(attr.fullname))) {
					// 作为样式类的属性
					const parentStyle = (node.parentNode as ITag).styles;
					// 如果父元素上有同名的样式类属性，则不能移除和默认值相同的属性
					if (!attrDefine.inherited || !parentStyle || !hasProp(parentStyle, attr.fullname)) {
						if (attrIsEqual(attrDefine, attr.value, node.nodeName)) {
							node.removeAttribute(attr.fullname);
							continue;
						}
					}
				} else {
					if (attrIsEqual(attrDefine, attr.value, node.nodeName)) {
						node.removeAttribute(attr.fullname);
						continue;
					}
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
	});
	resolve();
});
