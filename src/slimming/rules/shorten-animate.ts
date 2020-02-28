import { animationElements, animationAttributes, animationAttrElements, shapeElements } from '../const/definitions';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';
import { getById } from '../xml/get-by-id';
import { regularAttr } from '../const/regular-attr';
import { legalValue } from '../validate/legal-value';

export const shortenAnimate = async (rule: TFinalConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		const { remove } = rule[1] as { remove: boolean };
		// tslint:disable-next-line: cyclomatic-complexity
		traversalNode(node => animationElements.includes(node.nodeName), (node: ITagNode) => {
			if (remove) {
				rmNode(node);
				return;
			}

			// 处理 attributeName 属性
			if (animationAttrElements.includes(node.nodeName)) {
				// 先取出来 attributeName 属性
				const attributeName = node.getAttribute('attributeName') || '';
				if (!attributeName || !regularAttr[attributeName].animatable) {
					// attributeName 指定了不能实现动画的属性，视为无效
					rmNode(node);
					return;
				}

				// animateTransform 只能修改 tranform 类型的属性
				// https://svgwg.org/specs/animations/#SVGExtensionsToSMILAnimation
				if (node.nodeName === 'animateTransform' && attributeName !== 'transform' && attributeName !== 'patternTransform') {
					rmNode(node);
					return;
				}

				for (const attr of node.attributes) {
					// 对动画属性 from、to、by、values 的值进行合法性验证
					if (animationAttributes.includes(attr.fullname)) {
						// 动画属性不合法
						if ((attr.fullname !== 'values' && !legalValue(regularAttr[attributeName], attr))) {
							node.removeAttribute(attr.fullname);
							continue;
						}
						// values 是以分号分隔的，需要分隔后对每一项进行合法性验证
						const values = attr.value.split(';');
						if (values.every(val => !legalValue(regularAttr[attributeName], {
							name: 'values',
							fullname: 'values',
							namespace: '',
							value: val.trim(),
						}))) {
							node.removeAttribute(attr.fullname);
						}
					}
				}

				if (node.nodeName === 'set' && !node.getAttribute('to')) {
					rmNode(node);
					return;
				}

				if (!animationAttributes.some(key => node.hasAttribute(key))) {
					rmNode(node);
					return;
				}
			}

			// animateMotion 如果没有 path 属性，则必须包含有效的 mpath ，规则是 href 或 xlink:href 指向 path 或 shape 元素
			if (node.nodeName === 'animateMotion') {
				if (!node.hasAttribute('path') && !node.childNodes.some(subNode => {
					if (subNode.nodeName !== 'mpath') {
						return false;
					}
					const id = subNode.getAttribute('href') || subNode.getAttribute('xlink:href');
					if (!id) {
						return false;
					}
					const target = getById(id, dom);
					if (!target) {
						return false;
					}
					return shapeElements.includes(target.nodeName);
				})) {
					rmNode(node);
					return;
				}
			}

			// 不管 href 能不能找到目标，都移除该属性
			const href = node.hasAttribute('href') ? node.getAttribute('href') : node.getAttribute('xlink:href');
			if (href) {
				const target = getById(href, dom);
				if (target) {
					target.appendChild(node);
				}
			}
			node.removeAttribute('href');
			node.removeAttribute('xlink:href');
		}, dom);
	}
	resolve();
});
