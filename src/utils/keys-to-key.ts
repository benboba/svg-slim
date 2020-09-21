import { TDynamicObj } from '../../typings';

export const keysToKey = <T = string>(obj: TDynamicObj<T>) => Object.keys(obj).sort().join('|');
