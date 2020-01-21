import { animationAttributes, animationAttrElements, ariaAttributes, eventAttributes } from '../const/definitions';
import { regularAttr } from '../const/regular-attr';
import { regularTag } from '../const/regular-tag';
import { legalValue } from '../validate/legal-value';
import { execStyleTree } from '../xml/exec-style-tree';
import { isTag } from '../xml/is-tag';
import { traversalNode } from '../xml/traversal-node';
import { attrIsEqual } from '../xml/attr-is-equal';

// rm-attirbute 不再验证 css 类的属性，只关注该 css 属性是否是 svg 所支持的
export const rmAttribute = async (rule: TFinalConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
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
				execStyleTree(dom as ITagNode);
			}

			const tagDefine: IRegularTag = regularTag[node.nodeName];
			// 先取出来 attributeName 属性
			let attributeName = node.getAttribute('attributeName') || '';
			if (attributeName && !regularAttr[attributeName].animatable) {
				// attributeName 指定了不能实现动画的属性，视为无效
				attributeName = '';
				node.removeAttribute('attributeName');
			}

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
					if (
						animationAttributes.includes(attr.fullname) // 动画属性 from、to、by、values
						&&
						animationAttrElements.includes(node.nodeName) // 存在于动画元素上
						&&
						(
							!attributeName // 没有 attributeName 属性的动画没有意义
							||
							// TODO values 没有进一步验证合法性
							(attr.fullname !== 'values' && !legalValue(regularAttr[attributeName], attr, node.nodeName)) // 动画属性不合法
						)
					) {
						node.removeAttribute(attr.fullname);
						// 如果已经没有必备的动画属性，移除 attributeName 属性
						if (!animationAttributes.some(key => node.hasAttribute(key))) {
							node.removeAttribute('attributeName');
						}
						continue;
					}
				}

				if (rmDefault) {
					// 如果父元素上有同名的样式类属性，则不能移除和默认值相同的属性
					const parentStyle = (node.parentNode as ITagNode).styles;
					if (attrDefine.inherited && parentStyle && parentStyle.hasOwnProperty(attr.fullname)) {
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
