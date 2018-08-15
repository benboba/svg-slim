const pathReg = /([mMzZlLhHvVcCsSqQtTaA])(.*?)(?=[mMzZlLhHvVcCsSqQtTaA]|$)/g;

export interface IPathItem {
	type: string;
	val: number[];
}

export interface IPathResultItem extends IPathItem {
	from: number[];
}

export const execPath = (str): IPathItem[] => {
	const result: IPathItem[] = [];

	// 重置正则匹配位置
	pathReg.lastIndex = 0;

	let match = pathReg.exec(str);
	while (match !== null) {
		const val = match[2].trim();
		result.push({
			type: match[1],
			val: val ? val.replace(/(\d)(?=-)/g, '$1 ').split(/[,\s]+/).map(s => parseFloat(s)) : []
		});
		match = pathReg.exec(str);
	}
	return result;
};