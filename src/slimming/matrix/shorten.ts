import { IMatrixFunc } from './exec';
import { toFixed } from '../math/tofixed';

const matrixValLen = 6;
const matrixEPos = 4;

// 降低 transform 函数的参数精度，移除冗余参数，并对无效函数打上标记
export const shorten = (m: IMatrixFunc, digit1: number, digit2: number, digit3: number): IMatrixFunc => {
    const res: IMatrixFunc = {
        type: m.type,
        val: []
    };

    switch (m.type) {
        case 'translate':
            m.val.forEach((v, i) => {
                if (i < 2) {
                    res.val[i] = toFixed(digit2, v);
                }
            });
            if (res.val[1] === 0) {
                res.val.length = 1;
                if (res.val[0] === 0) {
                    res.noEffect = true;
                }
            }
            break;

        case 'scale':
            m.val.forEach((v, i) => {
                if (i < 2) {
                    res.val[i] = toFixed(digit1, v);
                }
            });
            if (res.val[0] === res.val[1]) {
                res.val.length = 1;
                if (res.val[0] === 1) {
                    res.noEffect = true;
                }
            }
            break;

        case 'rotate':
        case 'skewX':
        case 'skewY':
            res.val[0] = toFixed(digit3, m.val[0]);
            if (res.val[0] === 0) {
                res.noEffect = true;
            }
            break;

        case 'matrix':
            m.val.forEach((v, i) => {
                if (i < matrixValLen) {
                    res.val[i] = toFixed((i < matrixEPos) ? digit1 : digit2, v);
                }
            });
            if (res.val.length < matrixValLen || res.val.join(',') === '1,0,0,1,0,0') {
                res.noEffect = true;
            }
            break;

        default:
            break;
    }
    return res;
};