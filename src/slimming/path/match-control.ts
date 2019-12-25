// 匹配贝塞尔曲线的控制点

import { symmetry } from '../math/symmetry';

export const matchControl = (ctrl1X: number, ctrl1Y: number, centerX: number, centerY: number, ctrl2X: number, ctrl2Y: number) => symmetry(ctrl1X, centerX) === ctrl2X && symmetry(ctrl1Y, centerY) === ctrl2Y;
