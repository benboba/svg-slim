import { douglasPeucker as DP } from '../algorithm/douglas-peucker';
import { shapeElements } from '../const/definitions';
import { numberGlobal, numberPattern, pureNumOrWithPx } from '../const/syntax';
import { execNumberList } from '../utils/exec-numberlist';
import { shortenNumber } from '../utils/shorten-number';
import { shortenNumberList } from '../utils/shorten-number-list';
import { createTag } from '../xml/create';
import { execStyleTree } from '../xml/exec-style-tree';
import { checkAnimateAttr, getAnimateAttr } from '../xml/get-animate-attr';
import { getAttr } from '../xml/get-attr';
import { rmAttrs } from '../xml/rm-attrs';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

const startWithNumber = new RegExp(`^(${numberPattern})`);

const formatRect = (node: ITagNode) => {
	let width = getAttr(node, 'width', '0');
	let height = getAttr(node, 'height', '0');

	const widthExec = startWithNumber.exec(width);
	const heightExec = startWithNumber.exec(height);

	// 如果 width 或 height 不合规范，直接移除
	if (!widthExec || !heightExec || +widthExec[1] <= 0 || +heightExec[1] <= 0) {
		node.nodeName = 'remove';
		return;
	}

	// 如果 rx 或 ry 存在，不能转换为 path
	const rx = getAttr(node, 'rx', 'auto');
	const ry = getAttr(node, 'ry', 'auto');
	// rx 和 ry 相同，移除 ry
	if (rx === ry || ry === 'auto') {
		rmAttrs(node, ['ry']);
	}
	if (rx === 'auto') {
		rmAttrs(node, ['rx']);
	}
	const rxExec = startWithNumber.exec(rx);
	const ryExec = startWithNumber.exec(ry);
	if (rxExec && +rxExec[1] > 0 && (!ryExec || +ryExec[1] !== 0)) {
		return;
	}
	if (ryExec && +ryExec[1] > 0 && (!rxExec || +rxExec[1] !== 0)) {
		return;
	}

	let x = getAttr(node, 'x', '0');
	let y = getAttr(node, 'y', '0');

	// 如果不是 px 单位，不能转换为 path
	if (!pureNumOrWithPx.test(width) || !pureNumOrWithPx.test(height) || !pureNumOrWithPx.test(x) || !pureNumOrWithPx.test(y)) {
		return;
	}

	rmAttrs(node, ['x', 'y', 'width', 'height', 'rx', 'ry']);

	width = shortenNumber(+widthExec[1]);
	height = shortenNumber(+heightExec[1]);
	x = shortenNumber(+x.replace('px', ''));
	y = shortenNumber(+y.replace('px', ''));

	node.nodeName = 'path';
	// 此处考虑到宽和高的字节数差异，应该取较小的那种
	const hvh = shortenNumberList(`M${x},${y}h${width}v${height}h-${width}z`);
	const vhv = shortenNumberList(`M${x},${y}v${height}h${width}v-${height}z`);
	node.setAttribute('d', vhv.length < hvh.length ? vhv : hvh);

};

const formatLine = (node: ITagNode) => {
	const stroke = getAttr(node, 'stroke', '');
	const strokeWidth = getAttr(node, 'stroke-width', '1');

	const swExec = startWithNumber.exec(strokeWidth);
	const animateAttrs = getAnimateAttr(node);

	// 是否存在 marker 引用
	const hasMarker = getAttr(node, 'marker-start', 'none') !== 'none'
		|| getAttr(node, 'marker-mid', 'none') !== 'none'
		|| getAttr(node, 'marker-end', 'none') !== 'none'
		|| checkAnimateAttr(animateAttrs, 'marker-start', val => val !== 'none')
		|| checkAnimateAttr(animateAttrs, 'marker-mid', val => val !== 'none')
		|| checkAnimateAttr(animateAttrs, 'marker-end', val => val !== 'none');

	// 如果 stroke 或 stroke-width 不合规范，直接移除
	if (!hasMarker && (!stroke || stroke === 'none' || !swExec || +swExec[1] <= 0)) {
		node.nodeName = 'remove';
		return;
	}

	const shapeAttr = {
		x1: '0',
		y1: '0',
		x2: '0',
		y2: '0',
	};

	Object.keys(shapeAttr).forEach(key => {
		const value = node.getAttribute(key) as string;
		if (value && startWithNumber.test(value)) {
			shapeAttr[key as keyof typeof shapeAttr] = value;
		}
		node.removeAttribute(key);
	});

	// 是否存在 stroke
	const hasStroke = (
		getAttr(node, 'stroke', 'none') !== 'none' || checkAnimateAttr(animateAttrs, 'stroke', val => val !== 'none')
	) && (
		getAttr(node, 'stroke-width', '1') !== '0' || checkAnimateAttr(animateAttrs, 'stroke-width', val => val !== '0')
	);
	// 是否存在 stroke-linecap
	const hasStrokeCap = getAttr(node, 'stroke-linecap', 'butt') !== 'butt' || checkAnimateAttr(animateAttrs, 'stroke-linecap', val => val !== 'butt');
	// 如果没有发生移动，直接移除
	if (shapeAttr.x1 === shapeAttr.x2 && shapeAttr.y1 === shapeAttr.y2 && !hasMarker && (!hasStroke || !hasStrokeCap)) {
		node.nodeName = 'remove';
		return;
	}

	// 如果不是 px 单位，不能转换为 path
	if (pureNumOrWithPx.test(shapeAttr.x1) && pureNumOrWithPx.test(shapeAttr.y1) && pureNumOrWithPx.test(shapeAttr.x2) && pureNumOrWithPx.test(shapeAttr.y2)) {
		node.nodeName = 'path';
		node.setAttribute('d', shortenNumberList(`M${+shapeAttr.x1},${+shapeAttr.y1},${+shapeAttr.x2},${+shapeAttr.y2}`));
	}
};

const formatPoly = (thinning: number, node: ITagNode, addZ: boolean) => {
	node.nodeName = 'path';
	let d = '';
	if (node.hasAttribute('points')) {
		let points = execNumberList(node.getAttribute('points') as string);
		const animateAttrs = getAnimateAttr(node);
		// 是否存在 marker 引用
		const hasMarker = getAttr(node, 'marker-start', 'none') !== 'none'
			|| getAttr(node, 'marker-mid', 'none') !== 'none'
			|| getAttr(node, 'marker-end', 'none') !== 'none'
			|| checkAnimateAttr(animateAttrs, 'marker-start', val => val !== 'none')
			|| checkAnimateAttr(animateAttrs, 'marker-mid', val => val !== 'none')
			|| checkAnimateAttr(animateAttrs, 'marker-end', val => val !== 'none');
		// 是否存在 stroke
		const hasStroke = (
			getAttr(node, 'stroke', 'none') !== 'none' || checkAnimateAttr(animateAttrs, 'stroke', val => val !== 'none')
		) && (
			getAttr(node, 'stroke-width', '1') !== '0' || checkAnimateAttr(animateAttrs, 'stroke-width', val => val !== '0')
		);
		// 是否存在 stroke-linecap
		const hasStrokeCap = getAttr(node, 'stroke-linecap', 'butt') !== 'butt' || checkAnimateAttr(animateAttrs, 'stroke-linecap', val => val !== 'butt');
		if (points.length % 2 === 1) {
			points.pop();
		}
		if (thinning) {
			points = DP(thinning, points);
		}
		node.removeAttribute('points');

		// 有两个以上节点，或者具有 marker 或者是具有 stroke-linecap 的 polygon
		if (points.length > 2 || hasMarker || (hasStroke && hasStrokeCap && addZ)) {
			d = shortenNumberList(`M${points.map(shortenNumber).join(',')}`);
			if (addZ) {
				d += 'z';
			}
		}
	}
	if (d) {
		node.setAttribute('d', d);
	} else {
		// 没有节点或者没有 points 属性，直接移除当前 node
		node.nodeName = 'remove';
	}
};

const ellipseToCircle = (node: ITagNode, r: string) => {
	node.nodeName = 'circle';
	node.setAttribute('r', r.replace(numberGlobal, s => shortenNumber(+s)));
	rmAttrs(node, ['rx', 'ry']);
};

const formatEllipse = (node: ITagNode, originNode: ITagNode) => {
	let rx = getAttr(node, 'rx', 'auto');
	let ry = getAttr(node, 'ry', 'auto');
	if (rx === 'auto') {
		rx = ry;
	}
	if (ry === 'auto') {
		ry = rx;
	}

	const rxExec = startWithNumber.exec(rx);
	const ryExec = startWithNumber.exec(ry);

	// 如果 rx 或 ry 不合规范，直接移除
	if (!rxExec || !ryExec || +rxExec[1] <= 0 || +ryExec[1] <= 0) {
		node.nodeName = 'remove';
		return;
	}

	if (rx === ry) {
		ellipseToCircle(node, rx);
	}
};

const formatCircle = (node: ITagNode, originNode: ITagNode) => {
	const r = getAttr(node, 'r', '');
	const rExec = startWithNumber.exec(r);
	if (!rExec || +rExec[1] <= 0) {
		node.nodeName = 'remove';
	}
};

export const shortenShape = async (rule: TFinalConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		execStyleTree(dom as ITagNode);
		const {
			thinning,
		} = rule[1] as {
			thinning: number;
		};

		traversalNode(node => shapeElements.includes(node.nodeName), (node: ITagNode) => {
			const cloneNode = node.cloneNode();
			cloneNode.styles = node.styles;
			switch (node.nodeName) {
				case 'rect':
					formatRect(cloneNode);
					break;
				case 'line':
					formatLine(cloneNode);
					break;
				case 'polyline':
					formatPoly(thinning, cloneNode, false);
					break;
				case 'polygon':
					formatPoly(thinning, cloneNode, true);
					break;
				case 'ellipse':
					formatEllipse(cloneNode, node);
					break;
				case 'circle':
					formatCircle(cloneNode, node);
					break;
				default:
					// 路径只要判断 d 属性是否存在即可
					cloneNode.nodeName = node.getAttribute('d') ? 'notneed' : 'remove';
					break;
			}

			if (cloneNode.nodeName === 'remove') {
				rmNode(node);
			} else if (cloneNode.nodeName !== node.nodeName && createTag(cloneNode).length <= createTag(node).length) {
				Object.assign(node, cloneNode);
			}
		}, dom);
	}
	resolve();
});
