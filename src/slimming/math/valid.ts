import { Hundred } from '../const';

// 转换百分比格式字符串为数值
export const validPercent = (max: number, n: number) => Math.round(Math.max(Math.min(Hundred, n), 0) * max / Hundred);
// 转换非百分比格式字符串为数值
export const validNum = (max: number, n: number) => Math.max(Math.min(max, Math.round(n)), 0);
// 转换字符串为数值
export const valid = (isPercent: string, max: number, n: string) => isPercent ? validPercent(max, +n) : validNum(max, +n);
// 转换透明度数值
export const validOpacity = (p: string, n: string | number) => Math.max(Math.min(1, p ? +n / Hundred : +n), 0);
