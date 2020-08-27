import { filterPrimitiveElements, transferFunctionElements } from '../const/definitions';
import { hasProp } from '../utils/has-prop';
import { getAnimateAttr } from '../xml/get-animate-attr';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

const feFuncAttr = ['tableValues', 'slope', 'intercept', 'amplitude', 'exponent', 'offset'];
const feTypeNeed = {
	identity: [],
	table: ['tableValues'],
	discrete: ['tableValues'],
	linear: ['slope', 'intercept'],
	gamma: ['amplitude', 'exponent', 'offset'],
};

const checkFeAttrs = (type: string, rmAttrs: string[]) => {
	if (hasProp(feTypeNeed, type)) {
		feTypeNeed[type as keyof typeof feTypeNeed].forEach(val => {
			const index = rmAttrs.indexOf(val);
			if (index !== -1) {
				rmAttrs.splice(index, 1);
			}
		});
	}
};

export const shortenFilter = async (dom: IDomNode): Promise<void> => new Promise(resolve => {
	traversalNode(isTag, (node: ITagNode) => {
		if (filterPrimitiveElements.includes(node.nodeName) || node.nodeName === 'filter') {
			const width = node.getAttribute('width');
			const height = node.getAttribute('height');
			// 滤镜元素的 region 尺寸必须合法
			if ((width && parseFloat(width) <= 0) || (height && parseFloat(height) <= 0)) {
				rmNode(node);
				return;
			}
		}

		// filter 没有子元素没有意义
		if (node.nodeName === 'filter') {
			let hasFilterSub = false;
			node.childNodes.forEach(subNode => {
				if (filterPrimitiveElements.includes(subNode.nodeName)) {
					hasFilterSub = true;
				}
			});
			if (!hasFilterSub) {
				rmNode(node);
				return;
			}
		}

		// feComponentTransfer 的同一个类型的 transferFunctionElement 子元素不允许多次出现
		if (node.nodeName === 'feComponentTransfer') {
			const funcUnique: TUnique = {};
			for (let i = node.childNodes.length; i--;) {
				const childNode = node.childNodes[i];
				if (funcUnique[childNode.nodeName]) {
					rmNode(childNode);
					continue;
				}
				if (transferFunctionElements.includes(childNode.nodeName)) {
					funcUnique[childNode.nodeName] = true;
				}
			}
		}

		// transferFunctionElement 不同的 type 所需的属性不一样，其它不必要的属性都可以删掉
		// https://drafts.fxtf.org/filter-effects/#element-attrdef-fecomponenttransfer-type
		if (transferFunctionElements.includes(node.nodeName)) {
			const type = node.getAttribute('type') || '';
			const animateAttrs = getAnimateAttr(node).filter(item => item.attributeName === 'type');
			if (!type && !animateAttrs.length) {
				rmNode(node);
				return;
			}
			const rmAttrs = feFuncAttr.slice();
			// 保留当前 type 必备的属性
			checkFeAttrs(type, rmAttrs);
			// 遍历并保留每一个 animate type 的必备属性
			animateAttrs.forEach(item => {
				item.values.forEach(val => {
					checkFeAttrs(val, rmAttrs);
				});
			});
			// 最后移除掉不必要的属性
			rmAttrs.forEach(attr => {
				node.removeAttribute(attr);
			});
		}
	}, dom);
	resolve();
});
