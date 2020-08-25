import { decode } from 'he';

const cssReg = /([^:;]+):((?:[^;'"]*?(?:(?:'[^']*?'|"[^"]*?"|\/\*.*?\*\/))*[^;'"]*?)*)(?=;|$)/gim;

export const parseStyle = (styleStr: string): IAttr[] => {
	// 此处使用数组，因为不能在解析器中排重，排重的工作要交给优化工具
	const style: IAttr[] = [];
	const str = decode(styleStr, {
		isAttributeValue: true,
	});
	// 重置正则
	cssReg.lastIndex = 0;

	let match = cssReg.exec(str);
	while (match !== null) {
		// 去除前导注释和空格
		const name = match[1].replace(/^(?:\s*\/\*.+?\*\/\s*)*/g, '').trim().replace(/\s/g, '');
		// 去除两端注释和冗余空格
		const value = match[2].replace(/^(?:\s*\/\*.+?\*\/\s*)*|(?:\s*\/\*.+?\*\/\s*)*$/g, '').trim().replace(/\s+/, ' ');
		// 只保留非空
		if (name && value) {
			style.push({
				fullname: name,
				name,
				value,
			});
		}
		match = cssReg.exec(str);
	}
	return style;
};
