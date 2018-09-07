import { toScientific } from './to-scientific';

// 将函数类参数转为字符串，并优化
export const stringifyFuncVal = (s: number[]): string => {
    // 首先转科学计数法
    let res = s.map(toScientific).join(',');
    // 移除掉正、负号前面的逗号，移除掉0.前面的0，移除掉.1,.1或e1,.1这种case中间的逗号
    return res.replace(/,([+-])/g, '$1').replace(/(^|[^\d])0\./g, '$1.').replace(/([\.eE]\d+),\./g, '$1.');
};