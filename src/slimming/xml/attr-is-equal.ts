import { equals } from 'ramda';
import { execColor } from '../color/exec';
import { execNumberList } from '../utils/exec-numberlist';

export const valueIsEqual = (attrDefine: IRegularAttr, value1: string, value2: string): boolean => {
	if (value1 === value2) {
		return true;
	}
	if (attrDefine.maybeColor) {
		const color1 = execColor(value1);
		const color2 = execColor(value2);
		color1.origin = '';
		color2.origin = '';
		if (equals(color1, color2)) {
			return true;
		}
	}
	if (attrDefine.maybeSizeNumber || attrDefine.maybeAccurateNumber) {
		const nums2 = execNumberList(value2);
		if (nums2.length > 0 && equals(execNumberList(value1), nums2)) {
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
