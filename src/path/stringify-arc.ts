import { shortenNumber } from '../utils/shorten-number';
import { shortenNumberList } from '../utils/shorten-number-list';

const FLAG_POS1 = 3;
const FLAG_POS2 = 4;
const LOOP_LEN = 7;

// 将函数类参数转为字符串，并优化（转科学计数法，移除掉正、负号前面的逗号，移除掉0.前面的0，移除掉.1,.1或e1,.1这种case中间的逗号）
// 特殊，针对 arc 类 path 指令，flag 位后面不需要跟逗号
export const stringifyArc = (s: number[]): string => shortenNumberList(s.reduce((prev, curr, index) => {
	if (index % LOOP_LEN === FLAG_POS1 || index % LOOP_LEN === FLAG_POS2 || index === s.length - 1) {
		return `${prev}${shortenNumber(curr)}`;
	} else {
		return `${prev}${shortenNumber(curr)},`;
	}
}, ''));
