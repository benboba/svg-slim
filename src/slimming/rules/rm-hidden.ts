import { gt, gte } from 'ramda';
import { shapeElements, animationAttrElements, animationElements, animationAttributes } from '../const/definitions';
import { regularTag } from '../const/regular-tag';
import { IRIFullMatch } from '../const/syntax';
import { execStyleTree } from '../xml/exec-style-tree';
import { getAncestor } from '../xml/get-ancestor';
import { getAttr } from '../xml/get-attr';
import { getById } from '../xml/get-by-id';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

// 检测数值类属性
const checkNumberAttr = (node: ITagNode, key: string, allowEmpty: boolean, allowAuto: boolean, allowZero: boolean): boolean => {
	const val = getAttr(node, key, '');

	// 是否允许为空
	if (!val) return allowEmpty;

	// 是否允许 auto
	if (val === 'auto') return allowAuto;

	// 是否必须大于 0
	const compare = allowZero ? gte : gt;
	if (compare(parseFloat(val), 0)) {
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
	feBlend: {
		attrs: ['width', 'height'],
		allowEmpty: false,
		allowAuto: false,
		allowZero: false,
	},
	feColorMatrix: {
		attrs: ['width', 'height'],
		allowEmpty: false,
		allowAuto: false,
		allowZero: false,
	},
	feComponentTransfer: {
		attrs: ['width', 'height'],
		allowEmpty: false,
		allowAuto: false,
		allowZero: false,
	},
	feComposite: {
		attrs: ['width', 'height'],
		allowEmpty: false,
		allowAuto: false,
		allowZero: false,
	},
	feConvolveMatrix: {
		attrs: ['width', 'height'],
		allowEmpty: false,
		allowAuto: false,
		allowZero: false,
	},
	feDiffuseLighting: {
		attrs: ['width', 'height'],
		allowEmpty: false,
		allowAuto: false,
		allowZero: false,
	},
	feDisplacementMap: {
		attrs: ['width', 'height'],
		allowEmpty: false,
		allowAuto: false,
		allowZero: false,
	},
	feDropShadow: {
		attrs: ['width', 'height'],
		allowEmpty: false,
		allowAuto: false,
		allowZero: false,
	},
	feFlood: {
		attrs: ['width', 'height'],
		allowEmpty: false,
		allowAuto: false,
		allowZero: false,
	},
	feGaussianBlur: {
		attrs: ['width', 'height'],
		allowEmpty: false,
		allowAuto: false,
		allowZero: false,
	},
	feImage: {
		attrs: ['width', 'height'],
		allowEmpty: false,
		allowAuto: false,
		allowZero: false,
	},
	feMerge: {
		attrs: ['width', 'height'],
		allowEmpty: false,
		allowAuto: false,
		allowZero: false,
	},
	feMorphology: {
		attrs: ['width', 'height'],
		allowEmpty: false,
		allowAuto: false,
		allowZero: false,
	},
	feOffset: {
		attrs: ['width', 'height'],
		allowEmpty: false,
		allowAuto: false,
		allowZero: false,
	},
	feSpecularLighting: {
		attrs: ['width', 'height'],
		allowEmpty: false,
		allowAuto: false,
		allowZero: false,
	},
	feTile: {
		attrs: ['width', 'height'],
		allowEmpty: false,
		allowAuto: false,
		allowZero: false,
	},
	feTurbulence: {
		attrs: ['width', 'height'],
		allowEmpty: false,
		allowAuto: false,
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
				if (!node.getAttribute('attributeName')) {
					rmNode(node);
					return;
				}
				if (node.nodeName === 'set' && !node.getAttribute('to')) {
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

			if (styles.hasOwnProperty('display') && styles.display.value === 'none') {
				rmNode(node);
				return;
			}

			// 没有填充和描边的形状，不一定可以被移除，要再判断一下自身或父元素是否有 id
			if (shapeElements.includes(node.nodeName)) {
				const noFill = styles.hasOwnProperty('fill') && styles.fill.value === 'none';
				const noStroke = !styles.hasOwnProperty('stroke') || styles.stroke.value === 'none';
				if (noFill && noStroke && !getAncestor(node, (n: INode) => n.hasAttribute('id'))) {
					rmNode(node);
					return;
				}
			}

			if (numberMap.hasOwnProperty(node.nodeName as keyof typeof numberMap)) {
				const nubmerItem = numberMap[node.nodeName as keyof typeof numberMap];
				for (let i = nubmerItem.attrs.length; i--;) {
					if (!checkNumberAttr(node, nubmerItem.attrs[i], nubmerItem.allowEmpty, nubmerItem.allowAuto, nubmerItem.allowZero)) {
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
