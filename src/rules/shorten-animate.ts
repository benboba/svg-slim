import { IDocument, ITagNode } from 'svg-vdom';
import { IRuleOption } from '../../typings';
import { checkAnimateMotion } from '../animate/check-animate-motion';
import { animationAttrElements, animationAttributes, animationElements } from '../const/definitions';
import { regularAttr } from '../const/regular-attr';
import { regularTag } from '../const/regular-tag';
import { legalValue } from '../validate/legal-value';

export const shortenAnimate = async (dom: IDocument, { option: { remove } }: IRuleOption): Promise<void> => new Promise(resolve => {
	const animateNodes = dom.querySelectorAll(animationElements.join(',')) as ITagNode[];
	animateNodes.forEach(node => {
		if (remove) {
			node.remove();
			return;
		}

		// 不管 href 能不能找到目标，都移除该属性，改为设置成 target 的子元素
		const href = node.hasAttribute('href') ? node.getAttribute('href') : node.getAttribute('xlink:href');
		if (href) {
			const target = dom.querySelector(href) as ITagNode;
			if (target) {
				target.appendChild(node);
			}
		}
		node.removeAttribute('href');
		node.removeAttribute('xlink:href');

		// 处理 attributeName 属性
		if (animationAttrElements.includes(node.nodeName)) {
			// 先取出来 attributeName 属性
			const attributeName = node.getAttribute('attributeName') || '';
			const animateDefine = regularAttr[attributeName];
			if (!attributeName || !animateDefine.animatable) {
				// attributeName 指定了不能实现动画的属性，视为无效
				node.remove();
				return;
			}

			// attributeName 和父元素不匹配
			const parentName = (node.parentNode as ITagNode).nodeName;
			if (!animateDefine.applyTo.includes(parentName) && !regularTag[parentName].ownAttributes.includes(attributeName)) {
				node.remove();
				return;
			}

			// animateTransform 只能修改 tranform 类型的属性
			// https://svgwg.org/specs/animations/#SVGExtensionsToSMILAnimation
			if (node.nodeName === 'animateTransform' && attributeName !== 'transform' && attributeName !== 'patternTransform') {
				node.remove();
				return;
			}

			for (const attr of node.attributes) {
				// 对动画属性 from、to、by、values 的值进行合法性验证
				if (animationAttributes.includes(attr.fullname)) {
					// 动画属性不合法
					if ((attr.fullname !== 'values' && !legalValue(animateDefine, attr))) {
						node.removeAttribute(attr.fullname);
						continue;
					}
					// values 是以分号分隔的，需要分隔后对每一项进行合法性验证
					const values = attr.value.split(';');
					if (values.every(val => !legalValue(animateDefine, {
						name: 'values',
						fullname: 'values',
						namespace: '',
						value: val.trim(),
					}))) {
						node.removeAttribute(attr.fullname);
					}
				}
			}

			if (node.nodeName === 'set' && !node.hasAttribute('to')) {
				node.remove();
				return;
			}

			if (!animationAttributes.some(key => node.hasAttribute(key))) {
				node.remove();
				return;
			}
		}

		// animateMotion 如果没有 path 属性，则必须包含有效的 mpath ，规则是 href 或 xlink:href 指向 path 或 shape 元素
		if (node.nodeName === 'animateMotion') {
			if (!checkAnimateMotion(node, dom)) {
				node.remove();
				return;
			}
		}
	});
	resolve();
});
