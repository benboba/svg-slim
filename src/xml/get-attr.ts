import { ITag } from '../../typings/node';
import { IStyleObj } from '../../typings/style';
import { hasProp } from '../utils/has-prop';

// 获取属性（根据 SVG 覆盖规则，css 优先）
export const getAttr = (node: ITag, key: string, defaultVal: string): string => {
	let val = defaultVal;
	const styles = node.styles as IStyleObj;
	if (hasProp(styles, key)) {
		val = styles[key].value;
	}
	return val;
};
