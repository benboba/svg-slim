import { ConfigItem } from './config';

export function toArray(v: boolean | ConfigItem): ConfigItem {
    if (typeof v === 'boolean') {
        return [v];
    } else {
        return v;
    }
}
