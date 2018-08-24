import { config, IConfig, ConfigItem } from './config/config';
import { rules } from './rules/index';
import { toArray } from './utils/to-array';
import { createXML } from './xml/create';
import { parse } from '../xml-parser/app';
import { INode, NodeType } from '../node';

interface ISvgSlimming {
	(data: string, userConfig: IConfig): Promise<string>;
	xmlParser?(s: string): Promise<INode>;
	NodeType?: Object;
}

const exportFunc: ISvgSlimming = (data: string, userConfig: IConfig = {}): Promise<string> => new Promise((resolve, reject) => {
	parse(data).then((dom: INode) => {
		const finalConfig: IConfig = {};
		Object.assign(finalConfig, config, userConfig);

		(async () => {
			for (const item of rules) {
				if (item[0]) {
					await (item[1] as (n: INode) => Promise<null>)(dom);
				} else {
					await (item[1] as (c: ConfigItem, n: INode) => Promise<null>)(toArray(finalConfig[item[2] as string]) as ConfigItem, dom);
				}
			}
			resolve(createXML(dom));
		})();

	}, reject);
});

exportFunc.xmlParser = parse;
exportFunc.NodeType = NodeType;

export = exportFunc;