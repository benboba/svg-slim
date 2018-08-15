import { config } from './config/config';
import { rules } from './rules/index';
import { toArray } from './utils/to-array';
import { createXML } from './xml/create';
import { parse } from '../xml-parser/app';

export = (data, userConfig = {}) => new Promise((resolve, reject) => {
	parse(data).then((dom) => {
		const finalConfig = {};
		Object.assign(finalConfig, config, userConfig);

		(async () => {
			for (const item of rules) {
				if (item[0]) {
					await (item[1] as Function)(dom);
				} else {
					await (item[1] as Function)(toArray(finalConfig[item[2] as string]), dom);
				}
			}
			resolve(createXML(dom));
		})();

	}, reject);
});