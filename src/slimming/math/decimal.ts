/*
 * 以字符串的形式返回小数部分
 */

export const decimal = (a: string | number): string => {
	const astr = `${a}`;
	if (astr.indexOf('.') === -1) {
		return '';
	} else {
		return astr.slice(astr.indexOf('.') + 1);
	}
};