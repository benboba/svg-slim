import { INode, NodeType } from '../node';
import { parse } from '../xml-parser/app';
import { config, ConfigItem, IConfig } from './config/config';
import { toArray } from './config/to-array';
import { ITagNode } from './interface/node';
import { rules } from './rules/index';
import { createXML } from './xml/create';

interface ISvgSlimming {
	(data: string, userConfig: IConfig): Promise<string>;
	xmlParser?(s: string): Promise<INode>;
	NodeType?: Object;
}

const exportFunc: ISvgSlimming = async (data: string, userConfig: IConfig = {}): Promise<string> => new Promise((resolve, reject) => {
	parse(data).then((dom: INode) => {
		const finalConfig: IConfig = Object.create(config) as IConfig;
		Object.keys(userConfig).forEach(key => {
			if (finalConfig.hasOwnProperty(key)) {
				const conf1 = toArray(finalConfig[key]);
				const conf2 = toArray(userConfig[key]);
				conf2.forEach((conf, k) => {
					if (typeof conf1[k] === typeof conf) {
						conf1[k] = conf;
					}
				});
				finalConfig[key] = conf1;
			}
		});

		(async () => {
			for (const item of rules) {
				if (item[0]) {
					await (item[1] as (n: INode) => Promise<null>)(dom as ITagNode);
				} else {
					await (item[1] as (c: ConfigItem, n: INode) => Promise<null>)(toArray(finalConfig[item[2]]), dom as ITagNode);
				}
			}
			resolve(createXML(dom as ITagNode));
		})();

	}, reject);
});

exportFunc.xmlParser = parse;
exportFunc.NodeType = NodeType;

export = exportFunc;
