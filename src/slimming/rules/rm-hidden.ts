import { INode } from '../../node/index';
import { TConfigItem } from '../config/config';
import { shapeElements } from '../const/definitions';
import { regularTag } from '../const/regular-tag';
import { IStyleObj, ITagNode } from '../interface/node';
import { execStyleTree } from '../xml/exec-style-tree';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

const checkNumberAttr = (node: ITagNode, key: string): boolean => {
	const styles = node.styles as IStyleObj;
	if (!styles.hasOwnProperty(key) && !node.hasAttribute(key)) {
		return false;
	}
	if (styles.hasOwnProperty(key) && parseFloat(styles[key].value) > 0) {
		return true;
	}
	if (parseFloat(`${node.getAttribute(key)}`) > 0) {
		return true;
	}
	return false;
};

const checkRequired = (node: ITagNode, key: string): boolean => node.hasAttribute(key) && node.getAttribute(key) !== '';

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

const checkLine = (node: ITagNode) => {
	const x1 = getAttr(node, 'x1', '0');
	const y1 = getAttr(node, 'y1', '0');
	const x2 = getAttr(node, 'x2', '0');
	const y2 = getAttr(node, 'y2', '0');
	if (x1 === x2 && y1 === y2) {
		rmNode(node);
	}
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

			const noFill = styles.hasOwnProperty('fill') && styles.fill.value === 'none';
			const noStroke = !styles.hasOwnProperty('stroke') || styles.stroke.value === 'none';

			if (noFill && noStroke && shapeElements.indexOf(node.nodeName) !== -1) {
				rmNode(node);
				return;
			}

			switch (node.nodeName) {
				// 路径必须有 d 属性
				case 'path':
					if (!checkRequired(node, 'd')) {
						rmNode(node);
					}
					break;

				// polyline 和 polygon 必须有 points 属性
				case 'polyline':
				case 'polygon':
					if (!checkRequired(node, 'points')) {
						rmNode(node);
					}
					break;

				// 矩形的宽高必须均大于 0
				case 'rect':
					if (!checkNumberAttr(node, 'width') || !checkNumberAttr(node, 'height')) {
						rmNode(node);
					}
					break;

				// 圆和椭圆的半径必须大于 0
				case 'circle':
					if (!checkNumberAttr(node, 'r')) {
						rmNode(node);
					}
					break;
				case 'ellipse':
					if (!checkNumberAttr(node, 'rx') || !checkNumberAttr(node, 'ry')) {
						rmNode(node);
					}
					break;

				// 线段长度不能为 0
				case 'line':
					checkLine(node);
					break;

				default:
					break;
			}

		}, dom);
	}
	resolve();
});
