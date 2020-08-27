import { NodeType } from './node';
import { parse } from './xml-parser';
import { rules } from './slimming/rules';
import { createXML } from './slimming/xml/create';
import { mergeConfig } from './slimming/config/merge';

const exportFunc: {
	(data: string, userConfig?: unknown): Promise<string>;
	xmlParser(s: string): Promise<INode>;
	NodeType: typeof NodeType;
} = async (data: string, userConfig: unknown = null): Promise<string> => new Promise((resolve, reject) => {
	parse(data).then(async dom => {
		const finalConfig = mergeConfig(userConfig);
		for (const item of rules) {
			const ruleConfig: Partial<IRuleOption> = {
				params: finalConfig.params,
				env: finalConfig.env,
			};
			if (item[0]) {
				await item[1](dom, ruleConfig as IRuleOption);
			} else {
				if (finalConfig.rules[item[2] as string][0]) {
					ruleConfig.option = finalConfig.rules[item[2] as string][1];
					await item[1](dom, ruleConfig as IRuleOption);
				}
			}
		}
		resolve(createXML(dom));
	}, reject);
});

exportFunc.xmlParser = parse;
exportFunc.NodeType = NodeType;

export default exportFunc;
