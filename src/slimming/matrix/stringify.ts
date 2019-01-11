import { IMatrixFunc } from './exec';
import { shorten } from './shorten';
import { stringifyFuncVal } from '../utils/stringify-funcval';

export const stringify = (m: IMatrixFunc[], digit1: number, digit2: number, digit3: number): string => {
    let result = '';
    m.forEach((v, i) => {
        const _v = shorten(v, digit1, digit2, digit3);
        if (!_v.noEffect) {
            result += `${_v.type}(${stringifyFuncVal(_v.val)})`;
        }
    });
    return result;
};
