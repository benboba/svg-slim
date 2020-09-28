import { mixWhiteSpace } from '../utils/mix-white-space';

export const shortenStyle = (s: string): string => mixWhiteSpace(s.trim()).replace(/\s*([@='"#.*+>~[\](){}:,;])\s*/g, '$1').replace(/;$/, '');
