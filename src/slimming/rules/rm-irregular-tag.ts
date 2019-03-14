import { INode } from '../../node/index';
import { regularTag } from '../const/regular-tag';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';
import { ConfigItem } from '../config/config';

export const rmIrregularTag = async (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		traversalNode(isTag, node => {
			// 在配置的忽略列表中
			if (Array.isArray(rule[1]) && (rule[1] as string[]).indexOf(node.nodeName) !== -1) {
				return;
			}

			if (regularTag[node.nodeName].isUndef) {
				rmNode(node);
			}
		}, dom);
	}
	resolve();
});
