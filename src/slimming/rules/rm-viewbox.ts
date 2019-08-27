import { equals } from 'ramda';
import { INode } from '../../node';
import { TConfigItem } from '../config/config';
import { ITagNode } from '../interface/node';
import { execNumberList } from '../utils/exec-numberlist';
import { traversalNode } from '../xml/traversal-node';

export const rmViewBox = async (rule: TConfigItem[], dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		traversalNode<ITagNode>(node => node.hasAttribute('viewBox'), node => {
			const size: number[] = [0, 0, 0, 0];
			const viewBox: number[] = execNumberList(node.getAttribute('viewBox') as string);

			// viewBox 属性的长度必须为 4，且 width 和 height 不能为负
			if (viewBox.length !== 4 || viewBox[2] < 0 || viewBox[3] < 0) {
				node.removeAttribute('viewBox');
				return;
			}

			node.attributes.forEach(attr => {
				if (node.nodeName === 'marker') {
					if (attr.fullname === 'markerWidth') {
						size[2] = +attr.value.replace('px', '');
					} else if (attr.fullname === 'markerHeight') {
						size[3] = +attr.value.replace('px', '');
					}
				} else {
					switch (attr.fullname) {
						case 'x':
							size[0] = parseFloat(attr.value);
							break;
						case 'y':
							size[1] = parseFloat(attr.value);
							break;
						case 'width':
							size[2] = parseFloat(attr.value);
							break;
						case 'height':
							size[3] = parseFloat(attr.value);
							break;
						default:
							break;
					}
				}
			});

			if (equals(size, viewBox)) {
				node.removeAttribute('viewBox');
			}
		}, dom);
	}
	resolve();
});
