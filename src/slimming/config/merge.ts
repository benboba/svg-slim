import { config } from './config';
import { toArray } from './to-array';

export const mergeConfig = (userConfig: unknown) => {
	const finalConfig: IConfig = {};
	Object.keys(config).forEach(key => {
		finalConfig[key] = config[key].slice();
	});
	if (typeof userConfig === 'object' && userConfig) {
		Object.keys(userConfig).forEach(key => {
			if (finalConfig.hasOwnProperty(key)) {
				const conf1 = finalConfig[key];
				const conf2 = toArray<unknown>(userConfig[key as keyof typeof userConfig]);
				conf2.forEach((conf, k) => {
					if (Array.isArray(conf1[k]) && Array.isArray(conf)) {
						conf1[k] = (conf as unknown[]).filter(v => typeof v === 'string') as string[];
					} else if (typeof conf1[k] === typeof conf) {
						if (typeof conf === 'number') { // tslint:disable-line prefer-conditional-expression
							conf1[k] = conf >= 0 ? conf : conf1[k];
						} else {
							conf1[k] = conf as TConfigItem;
						}
					}
				});
				finalConfig[key] = conf1;
			}
		});
	}
	return finalConfig;
};
