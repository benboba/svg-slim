import { INode } from '../../node/index';
import { IRegularTag, regularTag } from '../const/regular-tag';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

export const rmIrregularTag = (rule, dom: INode) => new Promise((resolve, reject) => {
	if (rule[0]) {
    	traversalNode(isTag, (node: INode) => {
			// 在配置的忽略列表中
			if (Array.isArray(rule[1]) && rule[1].indexOf(node.nodeName) !== -1) {
				return;
			}

			if ((regularTag[node.nodeName] as IRegularTag).isUndef) {
    			rmNode(node);
    		}
    	}, dom);
	}
	resolve();
});