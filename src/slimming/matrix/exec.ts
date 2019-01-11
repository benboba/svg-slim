import { execNumberList } from '../utils/exec-numberlist';

const matrixReg = /([a-z]+)\((.+?)\)/gim;

export interface IMatrixFunc {
	type: string; // 函数类型
	noEffect?: boolean; // 是否无效
	val: number[]; // 参数列表
}

export const execMatrix = (str: string): IMatrixFunc[] => {
	const result: IMatrixFunc[] = [];

	// 重置正则匹配位置
	matrixReg.lastIndex = 0;

	let match = matrixReg.exec(str);
	while (match !== null) {
		result.push({
			type: match[1],
			val: execNumberList(match[2]),
		});
		match = matrixReg.exec(str);
	}
	return result;
};
