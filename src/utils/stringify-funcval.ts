import { shortenNumber } from './shorten-number';
import { shortenNumberList } from './shorten-number-list';

// 将函数类参数转为字符串，并优化（转科学计数法，移除掉正、负号前面的逗号，移除掉0.前面的0，移除掉.1,.1或e1,.1这种case中间的逗号）
export const stringifyFuncVal = (s: number[]): string => shortenNumberList(s.map(shortenNumber).join(','));
