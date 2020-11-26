import { curry } from 'ramda';
import { plus } from './plus';
import { minus } from './minus';

// 获取 a 相对于 b 的对称值
export const symmetry = curry((a: number, b: number) => plus(b, minus(b, a)));
