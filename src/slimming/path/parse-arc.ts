import { numberGlobal } from '../const/syntax';

const FLAG_POS1 = 3;
const FLAG_POS2 = 4;
const LOOP_LEN = 7;

export const parseArc = (s: string): number[] => {
	const result: number[] = [];
	// 重要！含有 g 修饰符的正则表达式 exec 时要先重置！
	numberGlobal.lastIndex = 0;
	let matches = numberGlobal.exec(s);
	let pos = 0;
	while (matches) {
		if (pos % LOOP_LEN === FLAG_POS1 || pos % LOOP_LEN === FLAG_POS2) {
			if (matches[0][0] === '0' || matches[0][0] === '1') {
				result.push(+matches[0][0]);
				matches[0] = matches[0].slice(1);
				if (matches[0].length) {
					pos++;
					continue;
				}
			}
		} else {
			result.push(+matches[0]);
		}
		pos++;
		matches = numberGlobal.exec(s);
	}
	return result;
};
