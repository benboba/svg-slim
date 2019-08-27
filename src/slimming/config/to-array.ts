import { TConfigItem } from './config';

export const toArray = <T = TConfigItem>(v: unknown): T[] | TConfigItem[] => {
	if (typeof v === 'boolean') {
		return [v];
	} else if (Array.isArray(v) && typeof v[0] === 'boolean') {
		return v;
	} else {
		return [];
	}
};
