import { decode } from 'he';

export const execStyle = (styleStr: string): IAttr[] => {
	// 此处使用数组，因为不能在解析器中排重，排重的工作要交给优化工具
	const style: IAttr[] = [];
	decode(styleStr, {
		isAttributeValue: true,
	}).split(/\s*;\s*/).forEach(s => {
		const attr = s.trim().split(/\s*:\s*/);
		if (attr[0] && attr[1]) {
			style.push({
				fullname: attr[0],
				name: attr[0],
				value: attr[1],
			});
		}
	});
	return style;
};
