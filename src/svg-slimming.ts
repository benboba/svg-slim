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
	parse(data).then(async (dom: INode) => {
		const finalConfig = mergeConfig(userConfig);
		for (const item of rules) {
			if (item[0]) {
				await (item[1])(dom as ITagNode);
			} else {
				await (item[1])(finalConfig[item[2]], dom as ITagNode);
			}
		}
		resolve(createXML(dom as ITagNode));
	}, reject);
});

exportFunc.xmlParser = parse;
exportFunc.NodeType = NodeType;

export default exportFunc;
