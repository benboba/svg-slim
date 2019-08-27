import { numberGlobal, numberListFullMatch } from '../const/syntax';

export const execNumberList = (s: string): number[] => {
	const result: number[] = [];
	// 首先全字匹配字符串，不符合的直接退出
	if (numberListFullMatch.test(s)) {
		// 重要！含有 g 修饰符的正则表达式 exec 时要先重置！
		numberGlobal.lastIndex = 0;
		let matches = numberGlobal.exec(s);
		while (matches) {
			result.push(parseFloat(matches[0]));
			matches = numberGlobal.exec(s);
		}
	}
	return result;
};
