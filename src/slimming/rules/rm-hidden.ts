import { gt, gte } from 'ramda';
import { shapeElements, animationAttrElements, animationElements, animationAttributes, filterPrimitiveElements } from '../const/definitions';
import { regularTag } from '../const/regular-tag';
import { IRIFullMatch } from '../const/syntax';
import { execStyleTree } from '../xml/exec-style-tree';
import { getAncestor } from '../xml/get-ancestor';
import { getAttr } from '../xml/get-attr';
import { getById } from '../xml/get-by-id';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';
import { getAnimateAttr, checkAnimateAttr } from '../xml/get-animate-attr';

// 检测数值类属性
const checkNumberAttr = (node: ITagNode, key: string, allowEmpty: boolean, allowAuto: boolean, allowZero: boolean, animateAttrs: IAnimateAttr[]): boolean => {
	const val = getAttr(node, key, '');

	// 是否允许为空
	if (!val) return allowEmpty;

	// 是否允许 auto
	if (val === 'auto') return allowAuto;

	// 是否必须大于 0
	const compare = allowZero ? gte : gt;
	if (compare(parseFloat(val), 0) || checkAnimateAttr(animateAttrs, key, v => compare(parseFloat(val), 0))) {
		return true;
	}
	return false;
};

const checkUse = (node: ITagNode, dom: INode) => {
	if (!node.hasAttribute('href') && !node.hasAttribute('xlink:href')) {
		rmNode(node);
	} else {
		const value = (node.getAttribute('href') || node.getAttribute('xlink:href')) as string;
		const iri = IRIFullMatch.exec(value);
		if (iri) {
			const id = iri[1];
			// 不允许引用自身或祖先元素
			if (getAncestor(node, (n: INode) => n.getAttribute('id') === id)) {
				rmNode(node);
				return;
			}
			// 引用了不存在的元素
			if (!getById(value, dom)) {
				rmNode(node);
			}
		} else {
			rmNode(node);
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

export const rmHidden = async (rule: TFinalConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		execStyleTree(dom as ITagNode);

		traversalNode<ITagNode>(isTag, node => {

			// 未包含子节点的文本容器视为隐藏节点
			if (!node.childNodes.length && regularTag[node.nodeName].containTextNode) {
				rmNode(node);
				return;
			}

			// 对于 animate、set、animateTransform 元素，attributeName 是必须的属性
			if (animationAttrElements.includes(node.nodeName)) {
				const attributeName = node.getAttribute('attributeName');
				if (!attributeName) {
					rmNode(node);
					return;
				}
				if (node.nodeName === 'set' && !node.getAttribute('to')) {
					rmNode(node);
					return;
				}
				// animateTransform 只能修改 tranform 类型的属性
				// https://svgwg.org/specs/animations/#SVGExtensionsToSMILAnimation
				if (node.nodeName === 'animateTransform' && attributeName !== 'transform' && attributeName !== 'patternTransform') {
					rmNode(node);
					return;
				}
			}

			if (node.nodeName.indexOf('animate') === 0) {
				if (!animationAttributes.some(key => node.hasAttribute(key))) {
					rmNode(node);
					return;
				}
			}

			const styles = node.styles as IStyleObj;
			const animateAttrs = getAnimateAttr(node);

			if (
				styles.hasOwnProperty('display')
				&&
				styles.display.value === 'none'
				&&
				!['script', 'style', 'mpath'].concat(filterPrimitiveElements, animationElements).includes(node.nodeName)
				&&
				// 增加对动画的验证，对那些 display 为 none，但是动画会修改 display 的元素也不会进行移除
				!checkAnimateAttr(animateAttrs, 'display', val => val !== 'none')
			) {
				rmNode(node);
				return;
			}

			// 没有填充和描边的形状，不一定可以被移除，要再判断一下自身或父元素是否有 id
			if (shapeElements.includes(node.nodeName)) {
				const noFill = styles.hasOwnProperty('fill') && styles.fill.value === 'none' && !checkAnimateAttr(animateAttrs, 'fill', val => val !== 'none');
				const noStroke = (!styles.hasOwnProperty('stroke') || styles.stroke.value === 'none') && !checkAnimateAttr(animateAttrs, 'stroke', val => val !== 'none');
				if (noFill && noStroke && !getAncestor(node, (n: INode) => n.hasAttribute('id'))) {
					rmNode(node);
					return;
				}
			}

			if (numberMap.hasOwnProperty(node.nodeName as keyof typeof numberMap)) {
				const nubmerItem = numberMap[node.nodeName as keyof typeof numberMap];
				for (let i = nubmerItem.attrs.length; i--;) {
					if (!checkNumberAttr(node, nubmerItem.attrs[i], nubmerItem.allowEmpty, nubmerItem.allowAuto, nubmerItem.allowZero, animateAttrs)) {
						rmNode(node);
						return;
					}
				}
			}

			if (node.nodeName === 'use') {
				checkUse(node, dom);
			}

		}, dom);
	}
	resolve();
});
