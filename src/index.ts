import { parse } from 'svg-vdom';
import { createRuleConfig } from './config/create-rule-config';
import { mergeConfig } from './config/merge';
import { rules } from './rules';
import { createXML } from './xml/create';

export default async (data: string, userConfig: unknown = null): Promise<string> => new Promise((resolve, reject) => {
	const finalConfig = mergeConfig(userConfig);
	parse(data).then(async dom => {
		for (const item of rules) {
			const ruleConfig = createRuleConfig(finalConfig, item[2]);
			if (item[0]) {
				await item[1](dom, ruleConfig);
			} else {
				if (finalConfig.rules[item[2] as string][0]) {
					await item[1](dom, ruleConfig);
				}
			}
		}
		resolve(createXML(dom));
	}, reject);
});
