import { ISelector } from 'svg-vdom';
import { ITag } from '../../typings/node';
import { IStyleObj } from '../../typings/style';

// 检查是否被标签选择器命中
export const checkTypeSelector = (node: ITag) => Object.values((node.styles as IStyleObj)).some(val => {
	if (val.from === 'styletag') {
		const selector = val.selector as ISelector[];
		// 注意：只检查最后一项！
		if (selector[selector.length - 1].type === node.nodeName) {
			return true;
		}
	}
	return false;
});
