const matrixReg = /([a-z]+)\((.+?)\)/gi;

export interface IMatrixFunc {
	type: string;
	val: number[];
}

export const execMatrix = (str: string): IMatrixFunc[] => {
	const result: IMatrixFunc[] = [];

	// 重置正则匹配位置
	matrixReg.lastIndex = 0;

	let match = matrixReg.exec(str);
	while (match !== null) {
		result.push({
			type: match[1],
			val: match[2].trim().split(/[,\s]+/).map(s => parseFloat(s.trim()))
		});
		match = matrixReg.exec(str);
	}
	return result;
};