import { has } from 'ramda';
import { INode } from '../../node/index';
import { shapeElements } from '../const/definitions';
import { createTag } from '../xml/create';
import { traversalNode } from '../xml/traversal-node';
import { ConfigItem } from '../config/config';

const rectToPath = (node: INode) => {
	const shapeAttr = {
		x: '0',
		y: '0',
		width: '0',
		height: '0',
		rx: 'auto',
		ry: 'auto',
	};

	const attributes = node.attributes;
	for (let i = attributes.length; i--;) {
		const attr = attributes[i];
		if (has(attr.fullname, shapeAttr)) {
			shapeAttr[attr.fullname] = attr.value;
			node.removeAttribute(attr.fullname);
		}
	}
	if ((shapeAttr.rx !== '0' && shapeAttr.rx !== 'auto' && shapeAttr.ry !== '0') || (shapeAttr.ry !== '0' && shapeAttr.ry !== 'auto' && shapeAttr.rx !== '0')) {
		return;
	}

	node.nodeName = 'path';

	// 此处考虑到宽和高的字节数差异，应该取较小的那种
	const hvh = `M${shapeAttr.x},${shapeAttr.y}h${shapeAttr.width}v${shapeAttr.height}h${-shapeAttr.width}z`;
	const vhv = `M${shapeAttr.x},${shapeAttr.y}v${shapeAttr.height}h${shapeAttr.width}v${-shapeAttr.height}z`;
	node.setAttribute('d', vhv.length < hvh.length ? vhv : hvh);
};

const lineToPath = (node: INode) => {
	const shapeAttr = {
		x1: '0',
		y1: '0',
		x2: '0',
		y2: '0',
	};

	const attributes = node.attributes;
	for (let i = attributes.length; i--;) {
		const attr = attributes[i];
		if (has(attr.fullname, shapeAttr)) {
			shapeAttr[attr.fullname] = attr.value;
			node.removeAttribute(attr.fullname);
		}
	}

	node.nodeName = 'path';
	node.setAttribute('d', `M${shapeAttr.x1},${shapeAttr.y1}L${shapeAttr.x2},${shapeAttr.y2}`);
};

const polyToPath = (node: INode, addZ = false) => {
	const shapeAttr = {
		points: node.getAttribute('points'),
	};

	if (shapeAttr.points) {
		node.removeAttribute('points');
		node.nodeName = 'path';
		const points = shapeAttr.points.split(/[\s,]+/);
		if (points.length % 2 === 1) {
			points.pop();
		}

		let d = '';
		if (points.length === 0) {
			d = 'M0,0';
		} else if (points.length === 2) {
			d = `M${points[0]},${points[1]}`;
		} else {
			d = `M${points[0]},${points[1]}L${points.slice(2).join(',')}`;
		}

		if (addZ) {
			d += 'z';
		}

		node.setAttribute('d', d);
	}
};

export const shapeToPath = (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		traversalNode(node => shapeElements.indexOf(node.nodeName) !== -1, (node: INode) => {
			const cloneNode: INode = node.cloneNode();
			switch (node.nodeName) {
				case 'rect':
					rectToPath(cloneNode);
					break;
				case 'line':
					lineToPath(cloneNode);
					break;
				case 'polyline':
					polyToPath(cloneNode);
					break;
				case 'polygon':
					polyToPath(cloneNode, true);
					break;
				default:
					cloneNode.nodeName = 'notneed';
					break;
			}

			if (cloneNode.nodeName === 'path' && createTag(cloneNode).length <= createTag(node).length) {
				Object.assign(node, cloneNode);
			}
		}, dom);
	}
	resolve();
});