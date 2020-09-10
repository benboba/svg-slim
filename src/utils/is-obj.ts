import { TBaseObj } from '../../typings';

export const isObj = <T extends TBaseObj>(obj: unknown): obj is T => obj && typeof obj === 'object';
