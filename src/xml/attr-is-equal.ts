import { equals } from 'ramda';
import { IRegularAttr } from '../../typings';
import { parseColor } from '../color/parse';
import { parseAlpha } from '../math/parse-alpha';
import { parseNumberList } from '../utils/parse-numberlist';

export const valueIsEqual = (attrDefine: IRegularAttr, value1: string, value2: string): boolean => {
	if (value1 === value2) {
		return true;
	}

	// 对某些特殊类型的值，先尝试进行解析再判断

	// 颜色类型（例如 red、#f00、#ff0000、rgb(255,0,0) 都是等价的）
	if (attrDefine.maybeColor) {
		const color1 = parseColor(value1);
		const color2 = parseColor(value2);
		color1.origin = '';
		color2.origin = '';
		if (equals(color1, color2)) {
			return true;
		}
	}

	// 数值类型（例如 0.01、.01、1e-2 都是等价的）
	if (attrDefine.maybeSizeNumber || attrDefine.maybeAccurateNumber) {
		const nums2 = parseNumberList(value2);
		if (nums2.length > 0 && equals(parseNumberList(value1), nums2)) {
			return true;
		}
		// 特殊的，带单位的 0 和 0 是等价的
		if (/^0[a-z]*$/i.test(value1) && /^0[a-z]*$/i.test(value2)) {
			return true;
		}
	}

	// 不透明度类型（例如 50%、0.5、.5 都是等价的）
	if (attrDefine.maybeAlpha) {
		if (parseAlpha(value1) === parseAlpha(value2)) {
			return true;
		}
	}
	return false;
};

export const attrIsEqual = (attrDefine: IRegularAttr, value: string, nodeName: string): boolean => {
	if (typeof attrDefine.initValue === 'string') {
		return valueIsEqual(attrDefine, value, attrDefine.initValue);
	} else {
		const initValue = attrDefine.initValue;
		for (let ii = 0, il = initValue.length; ii < il; ii++) {
			if (initValue[ii].tag.includes(nodeName) && valueIsEqual(attrDefine, value, initValue[ii].val)) {
				return true;
			}
		}
	}
	return false;
};
