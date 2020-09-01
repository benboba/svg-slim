import { INode } from '../typings/node';
import { NodeType } from './node';
import { mergeConfig } from './slimming/config/merge';
import { rules } from './slimming/rules';
import { createXML } from './slimming/xml/create';
import { parse } from './xml-parser';
import { createRuleConfig } from './slimming/config/create-rule-config';

const exportFunc: {
	(data: string, userConfig?: unknown): Promise<string>;
	xmlParser(s: string): Promise<INode>;
	NodeType: typeof NodeType;
} = async (data: string, userConfig: unknown = null): Promise<string> => new Promise((resolve, reject) => {
	parse(data).then(async dom => {
		const finalConfig = mergeConfig(userConfig);
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

exportFunc.xmlParser = parse;
exportFunc.NodeType = NodeType;

export default exportFunc;
