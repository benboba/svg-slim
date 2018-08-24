// 匹配贝塞尔曲线的控制点

import { plus } from '../math/plus';
import { symmetry } from '../math/symmetry';

const POS_X1 = 0;
const POS_Y1 = 1;
const POS_X = 2;
const POS_Y = 3;

export const matchControl = (lastPos: number[], extraX: number, extraY: number, x1: number, y1: number) => plus(symmetry(lastPos[POS_X1], lastPos[POS_X]), extraX) === x1 && plus(symmetry(lastPos[POS_Y1], lastPos[POS_Y]), extraY) === y1;
