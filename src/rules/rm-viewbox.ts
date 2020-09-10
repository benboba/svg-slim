import { equals } from 'ramda';
import { IDocument, ITagNode } from 'svg-vdom';
import { parseNumberList } from '../utils/parse-numberlist';

export const rmViewBox = async (dom: IDocument): Promise<void> => new Promise(resolve => {
	const viewboxNodes = dom.querySelectorAll('[viewBox]') as ITagNode[];
	viewboxNodes.forEach(node => {
		const size: string[] = ['0', '0', '0', '0'];
		const viewBox: number[] = parseNumberList(node.getAttribute('viewBox') as string);

		// viewBox 属性的长度必须为 4，且 width 和 height 不能为负
		if (viewBox.length !== 4 || viewBox[2] < 0 || viewBox[3] < 0) {
			node.removeAttribute('viewBox');
			return;
		}

		node.attributes.forEach(attr => {
			if (node.nodeName === 'marker') {
				if (attr.fullname === 'markerWidth') {
					size[2] = attr.value.replace(/px$/, '');
				} else if (attr.fullname === 'markerHeight') {
					size[3] = attr.value.replace(/px$/, '');
				}
			} else {
				switch (attr.fullname) {
					case 'x':
						size[0] = attr.value.replace(/px$/, '');
						break;
					case 'y':
						size[1] = attr.value.replace(/px$/, '');
						break;
					case 'width':
						size[2] = attr.value.replace(/px$/, '');
						break;
					case 'height':
						size[3] = attr.value.replace(/px$/, '');
						break;
					default:
						break;
				}
			}
		});

		// x、y、width、height 可以是不同的单位，只有当单位是 px 且和 viewBox 各个位置相等时，才可以移除 viewBox
		if (equals(size, viewBox.map(s => `${s}`))) {
			node.removeAttribute('viewBox');
		}
	});
	resolve();
});
