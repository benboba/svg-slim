import { Hundred } from '../const';
import { toFixed } from './tofixed';

// 浮点数转百分比
export const toPercent = (digit: number, n: number) => `${toFixed(Math.max(digit - 2, 0), n * Hundred)}%`;
