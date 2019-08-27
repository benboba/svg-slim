import { execNumberList } from '../utils/exec-numberlist';
import { numberPattern, commaWsp } from '../const/syntax';

const matrixSingle = `(translate|scale|rotate|skewX|skewY|matrix)\\s*\\(\\s*(${numberPattern}(?:${commaWsp}${numberPattern})*)\\s*\\)`;
const matrixReg = new RegExp(matrixSingle, 'gm');
const matrixFullReg = new RegExp(`^${matrixSingle}(?:${commaWsp}${matrixSingle})*$`, 'm');

const matrixValLen = 6;

export interface IMatrixFunc {
	type: string; // 函数类型
	noEffect?: boolean; // 是否无效
	val: number[]; // 参数列表
}

export const execMatrix = (str: string): IMatrixFunc[] => {
	const result: IMatrixFunc[] = [];

	// 首先全字匹配完整的字符串，不匹配的直接退出
	if (matrixFullReg.test(str.trim())) {
		// 重置正则匹配位置
		matrixReg.lastIndex = 0;

		let match = matrixReg.exec(str);
		while (match !== null) {
			const val = execNumberList(match[2]);
			// 验证参数的个数是否合法，不合法的直接退出
			if (match[1] === 'translate' || match[1] === 'scale') {
				if (val.length > 2) {
					return [];
				}
			} else if (match[1] === 'matrix') {
				if (val.length !== matrixValLen) {
					return [];
				}
			} else {
				if (val.length !== 1) {
					return [];
				}
			}
			result.push({
				type: match[1],
				val,
			});
			match = matrixReg.exec(str);
		}
	}
	return result;
};
