import { equals } from 'ramda';
import { traversalNode } from '../xml/traversal-node';
import { ConfigItem } from '../config/config';
import { INode } from '../../node';
import { ITagNode } from '../interface/node';

interface IViewBox {
	x: string;
	y: string;
	width: string;
	height: string;
}

export const rmViewBox = async (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		traversalNode<ITagNode>(node => node.hasAttribute('viewBox'), node => {
			const size: IViewBox = {
				x: '0',
				y: '0',
				width: '100%',
				height: '100%',
			};
			const viewBox: IViewBox = {
				x: '0',
				y: '0',
				width: '100%',
				height: '100%',
			};

			node.attributes.forEach(attr => {
				if (node.nodeName === 'marker') {
					if (attr.fullname === 'markerWidth') {
						size.width = attr.value.replace('px', '');
					} else if (attr.fullname === 'markerHeight') {
						size.height = attr.value.replace('px', '');
					}
				} else {
					if (attr.fullname === 'width') {
						size.width = attr.value.replace('px', '');
					} else if (attr.fullname === 'height') {
						size.height = attr.value.replace('px', '');
					}
				}
				if (attr.fullname === 'viewBox') {
					[viewBox.x, viewBox.y, viewBox.width, viewBox.height] = attr.value.split(/[\s,]+/);
				}
			});

			if (equals(size, viewBox)) {
				node.removeAttribute('viewBox');
			}
		}, dom);
	}
	resolve();
});
