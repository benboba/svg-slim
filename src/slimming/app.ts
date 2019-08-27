import { INode, NodeType } from '../node';
import { parse } from '../xml-parser/app';
import { TConfigItem } from './config/config';
import { ITagNode } from './interface/node';
import { rules } from './rules/index';
import { createXML } from './xml/create';
import { mergeConfig } from './config/merge';

interface ISvgSlimming {
	(data: string, userConfig?: unknown): Promise<string>;
	xmlParser?(s: string): Promise<INode>;
	NodeType?: Object;
}

const exportFunc: ISvgSlimming = async (data: string, userConfig: unknown = null): Promise<string> => new Promise((resolve, reject) => {
	parse(data).then((dom: INode) => {
		const finalConfig = mergeConfig(userConfig);
		(async () => { // tslint:disable-line no-floating-promises
			for (const item of rules) {
				if (item[0]) {
					await (item[1] as (n: INode) => Promise<null>)(dom as ITagNode);
				} else {
					await (item[1] as (c: TConfigItem[], n: INode) => Promise<null>)(finalConfig[item[2]], dom as ITagNode);
				}
			}
			resolve(createXML(dom as ITagNode));
		})();

	}, reject);
});

exportFunc.xmlParser = parse;
exportFunc.NodeType = NodeType;

export = exportFunc;
