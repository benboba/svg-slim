import { complement, equals, gt, gte } from 'ramda';
import { IDocument, NodeType } from 'svg-vdom';
import { IAnimateAttr } from '../../typings';
import { ITag } from '../../typings/node';
import { IStyleObj } from '../../typings/style';
import { animationElements, filterPrimitiveElements, shapeElements } from '../const/definitions';
import { regularTag } from '../const/regular-tag';
import { IRIFullMatch } from '../const/syntax';
import { hasProp } from '../utils/has-prop';
import { checkAnimateAttr, getAnimateAttr } from '../xml/get-animate-attr';
import { getAttr } from '../xml/get-attr';
import { isTag } from '../xml/is-tag';
import { parseStyleTree } from '../xml/parse-style-tree';

// 检测数值类属性
const checkNumberAttr = (node: ITag, key: string, allowEmpty: boolean, allowAuto: boolean, allowZero: boolean, animateAttrs: IAnimateAttr[]): boolean => {
	const val = getAttr(node, key, '');

	// 是否允许为空
	if (!val) return allowEmpty;

	// 是否允许 auto
	if (val === 'auto') return allowAuto;

	// 是否必须大于 0
	const compare = allowZero ? gte : gt;
	if (compare(parseFloat(val), 0) || checkAnimateAttr(animateAttrs, key, () => compare(parseFloat(val), 0))) {
		return true;
	}
	return false;
};

const checkUse = (node: ITag, dom: IDocument) => {
	if (!node.hasAttribute('href') && !node.hasAttribute('xlink:href')) {
		node.remove();
	} else {
		const value = (node.getAttribute('href') || node.getAttribute('xlink:href')) as string;
		if (IRIFullMatch.test(value)) {
			const idStr = value.slice(1);
			// 不允许引用自身或祖先元素
			if (node.closest(n => n.nodeType === NodeType.Tag && (n as ITag).getAttribute('id') === idStr)) {
				node.remove();
				return;
			}
			// 引用了不存在的元素
			if (!dom.querySelector(n => n.nodeType === NodeType.Tag && (n as ITag).getAttribute('id') === idStr)) {
				node.remove();
			}
		} else {
			node.remove();
		}
	}
};

interface INumberMapItem {
	attrs: string[];
	allowEmpty: boolean;
	allowAuto: boolean;
	allowZero: boolean;
}

interface INumberMap {
	[nodeName: string]: INumberMapItem;
}

const numberMap: INumberMap = {
	pattern: {
		attrs: ['width', 'height'],
		allowEmpty: false,
		allowAuto: false,
		allowZero: false,
	},
	mask: {
		attrs: ['width', 'height'],
		allowEmpty: true,
		allowAuto: true,
		allowZero: false,
	},
	marker: {
		attrs: ['markerWidth', 'markerHeight'],
		allowEmpty: true,
		allowAuto: true,
		allowZero: false,
	},
	image: {
		attrs: ['width', 'height'],
		allowEmpty: true,
		allowAuto: true,
		allowZero: false,
	},
};

export const rmHidden = async (dom: IDocument): Promise<void> => new Promise(resolve => {
	parseStyleTree(dom);

	const tags = dom.querySelectorAll(NodeType.Tag) as ITag[];
	tags.forEach(node => {
		// 未包含子节点的文本容器视为隐藏节点
		if (!node.childNodes.length && regularTag[node.nodeName].containTextNode) {
			node.remove();
			return;
		}

		// textPath 如果没有 path 属性，则 href 和 xlink:href 必须指向 path 或 shape 元素
		if (node.nodeName === 'textPath') {
			if (!node.hasAttribute('path')) {
				const id = node.getAttribute('href') || node.getAttribute('xlink:href');
				if (!id) {
					node.remove();
					return;
				}
				const target = dom.querySelector(id);
				if (!target) {
					node.remove();
					return;
				}
				if (!shapeElements.includes(target.nodeName)) {
					node.remove();
					return;
				}
			}
		}

		const styles = node.styles as IStyleObj;
		const animateAttrs = getAnimateAttr(node);
		const notNone = complement(equals('none'));

		if (
			hasProp(styles, 'display')
			&&
			styles.display.value === 'none'
			&&
			!['script', 'style', 'mpath'].concat(filterPrimitiveElements, animationElements).includes(node.nodeName)
			&&
			// 增加对动画的验证，对那些 display 为 none，但是动画会修改 display 的元素也不会进行移除
			!checkAnimateAttr(animateAttrs, 'display', notNone)
		) {
			node.remove();
			return;
		}

		// 没有填充和描边的形状，不一定可以被移除，要再判断一下自身或父元素是否有 id
		if (shapeElements.includes(node.nodeName)) {
			const noFill = hasProp(styles, 'fill') && styles.fill.value === 'none' && !checkAnimateAttr(animateAttrs, 'fill', notNone);
			const noStroke = (!hasProp(styles, 'stroke') || styles.stroke.value === 'none') && !checkAnimateAttr(animateAttrs, 'stroke', notNone);
			if (noFill && noStroke && !node.closest(n => isTag(n) && n.hasAttribute('id'))) {
				node.remove();
				return;
			}
		}

		if (hasProp(numberMap, node.nodeName as keyof typeof numberMap)) {
			const nubmerItem = numberMap[node.nodeName as keyof typeof numberMap];
			for (let i = nubmerItem.attrs.length; i--;) {
				if (!checkNumberAttr(node, nubmerItem.attrs[i], nubmerItem.allowEmpty, nubmerItem.allowAuto, nubmerItem.allowZero, animateAttrs)) {
					node.remove();
					return;
				}
			}
		}

		if (node.nodeName === 'use') {
			checkUse(node, dom);
		}

	});
	resolve();
});
