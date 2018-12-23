import { IPathResultItem } from './exec';
import { toFixed } from '../math/tofixed';
import { APOS_LEN, APOS_X, APOS_Y, APOS_RX, APOS_RY, APOS_ROTATION } from './compute-a';

export const shortenDigit = (pathItem: IPathResultItem, digit1: number, digit2: number): number[] => {
    if (pathItem.type.toLowerCase() === 'a') {
        return pathItem.val.map((val, index) => {
            const i = index % APOS_LEN;
            if (i === APOS_RX || i === APOS_RY || i === APOS_X || i === APOS_Y) {
                return toFixed(digit1, val);
            } else if (i === APOS_ROTATION) {
                return toFixed(digit2, val);
            } else {
                return val;
            }
        });
    } else {
        return pathItem.val.map(val => toFixed(digit1, val));
    }
};