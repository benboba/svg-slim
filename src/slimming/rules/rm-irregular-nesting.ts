import { INode } from '../../node/index';
import { regularTag } from '../const/regular-tag';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';
import { ConfigItem } from '../config/config';
import { ITagNode } from '../interface/node';

export const rmIrregularNesting = async (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
    	traversalNode<ITagNode>(isTag, node => {
			// 在配置的忽略列表中
			if (Array.isArray(rule[1]) && (rule[1] as string[]).indexOf(node.nodeName) !== -1) {
				return;
			}

			let legalRule = regularTag[node.nodeName].legalChildElements;
			// any 表示可以任意嵌套
			if (legalRule.any) {
				return;
			}

			// noself 表示不允许嵌套自身
			const noself = legalRule.noself;

			// transparent 表示参照最近的非 switch 上级元素的规则
			if (legalRule.transparent) {
				let parent = node.parentNode;
				while (parent && parent.nodeName === 'switch') {
					parent = parent.parentNode;
				}
				if (!parent) return;
				legalRule = regularTag[parent.nodeName].legalChildElements;
				if (!noself && legalRule.any) return;
			}

			for (let i = node.childNodes.length; i--; ) {
				const childNode = node.childNodes[i];
				// 只针对 tag 类的子节点作处理
				if (!isTag(childNode)) {
					continue;
				}

				if (noself && childNode.nodeName === node.nodeName) { // 不允许嵌套自身
					rmNode(childNode);
				} else if (legalRule.any) { // transparent 和 noself 并存的情况（其实只有 a）
					continue;
				} else if (legalRule.childElements && legalRule.childElements.indexOf(childNode.nodeName) === -1) { // 不在嵌套列表中的情况
					rmNode(childNode);
				}
			}
    	}, dom);
	}
	resolve();
});
