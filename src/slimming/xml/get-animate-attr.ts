import { animationAttrElements } from '../const/definitions';

// 如果子对象包含动画元素，获取这些动画元素影响了哪些属性
export const getAnimateAttr = (node: ITagNode) => {
	const result: IAnimateAttr[] = [];
	node.childNodes.forEach(childNode => {
		if (animationAttrElements.includes(childNode.nodeName)) {
			const attributeName = childNode.getAttribute('attributeName');
			if (attributeName) {
				if (childNode.nodeName !== 'animateTransform' || attributeName === 'tranform' || attributeName === 'patternTransform') {
					const value: string[] = [];
					const from = childNode.getAttribute('from');
					const to = childNode.getAttribute('to');
					const by = childNode.getAttribute('by');
					const values = childNode.getAttribute('values');
					if (from) {
						value.push(from);
					}
					if (to) {
						value.push(to);
					}
					if (by) {
						value.push(by);
					}
					if (values) {
						value.push(...values.split(';').map(val => val.trim()).filter(val => !!val));
					}
					result.push({
						attributeName,
						value,
					});
				}
			}
		}
	});
	return result;
};

export const checkAnimateAttr = (animateAttrs: IAnimateAttr[], name: string, condition: (v: string) => boolean = (v: string) => true) => animateAttrs.some(item => item.attributeName === name && item.value.some(condition));
