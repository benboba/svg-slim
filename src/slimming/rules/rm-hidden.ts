import { shapeElements } from '../const/definitions';
import { regularTag } from '../const/regular-tag';
import { execStyleTree } from '../xml/exec-style-tree';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';
import { gt, gte } from 'ramda';
import { IRIFullMatch } from '../const/syntax';
import { getAncestor } from '../xml/get-ancestor';

// 获取属性（根据 SVG 覆盖规则，css 优先）
const getAttr = (node: ITagNode, key: string, defaultVal: string): string => {
	let val = defaultVal;
	if (node.hasAttribute(key)) {
		val = node.getAttribute(key) as string;
	}
	const styles = node.styles as IStyleObj;
	if (styles.hasOwnProperty(key)) {
		val = styles[key].value;
	}
	return val;
};

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

const checkRequired = (node: ITagNode, key: string): boolean => node.hasAttribute(key) && node.getAttribute(key) !== '';

const checkLine = (node: ITagNode) => {
	const x1 = getAttr(node, 'x1', '0');
	const y1 = getAttr(node, 'y1', '0');
	const x2 = getAttr(node, 'x2', '0');
	const y2 = getAttr(node, 'y2', '0');
	if (x1 === x2 && y1 === y2) {
		rmNode(node);
	}
};

const checkUse = (node: ITagNode) => {
	if (!node.hasAttribute('href') && !node.hasAttribute('xlink:href')) {
		rmNode(node);
	} else {
		const value = node.getAttribute('href') || node.getAttribute('xlink:href');
		const iri = IRIFullMatch.exec(value as string);
		if (iri) {
			const id = iri[1];
			// 不允许引用自身或祖先元素
			if (getAncestor(node, (n: INode) => n.getAttribute('id') === id)) {
				rmNode(node);
			}
		}
	}
};

const requireMap = {
	path: ['d'],
	polygon: ['points'],
	polyline: ['points'],
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
	rect: {
		attrs: ['width', 'height'],
		allowEmpty: false,
		allowAuto: false,
		allowZero: false,
	},
	pattern: {
		attrs: ['width', 'height'],
		allowEmpty: false,
		allowAuto: false,
		allowZero: false,
	},
	circle: {
		attrs: ['r'],
		allowEmpty: false,
		allowAuto: false,
		allowZero: false,
	},
	ellipse: {
		attrs: ['rx', 'ry'],
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

export const rmHidden = async (rule: TConfigItem[], dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		execStyleTree(dom as ITagNode);

		traversalNode<ITagNode>(isTag, node => {

			// 未包含子节点的文本容器视为隐藏节点
			if (!node.childNodes.length && regularTag[node.nodeName].containTextNode) {
				rmNode(node);
				return;
			}

			const styles = node.styles as IStyleObj;

			if (styles.hasOwnProperty('display') && styles.display.value === 'none') {
				rmNode(node);
				return;
			}

			// 没有填充和描边的形状，不一定可以被移除，要再判断一下自身或父元素是否有 id
			if (shapeElements.indexOf(node.nodeName) !== -1) {
				const noFill = styles.hasOwnProperty('fill') && styles.fill.value === 'none';
				const noStroke = !styles.hasOwnProperty('stroke') || styles.stroke.value === 'none';
				if (noFill && noStroke && !getAncestor(node, (n: INode) => n.hasAttribute('id'))) {
					rmNode(node);
					return;
				}
			}

			if (requireMap.hasOwnProperty(node.nodeName as keyof typeof requireMap)) {
				const requireItem = requireMap[node.nodeName as keyof typeof requireMap];
				for (let i = requireItem.length; i--;) {
					if (!checkRequired(node, requireItem[i])) {
						rmNode(node);
						return;
					}
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

			if (node.nodeName === 'line') {
				checkLine(node);
			} else if (node.nodeName === 'use' || node.nodeName === 'pattern') {
				checkUse(node);
			}

		}, dom);
	}
	resolve();
});
