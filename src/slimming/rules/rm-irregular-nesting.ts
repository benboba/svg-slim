import { both, curry } from 'ramda';
import { regularTag } from '../const/regular-tag';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';
import { getAncestor } from '../xml/get-ancestor';

// 在配置的忽略列表中
const notIgnore = curry((tags: string[], node: INode) => tags.indexOf(node.nodeName) === -1);

export const rmIrregularNesting = async (rule: TConfigItem[], dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		traversalNode<ITagNode>(both(isTag, notIgnore(rule[1] as string[])), node => {
			let legalRule = regularTag[node.nodeName].legalChildElements;
			// noself 表示不允许嵌套自身
			const noself = legalRule.noself;

			// transparent 表示参照最近的非 switch 上级元素的规则
			if (legalRule.transparent) {
				const parent = getAncestor(node.parentNode as ITagNode, (n: INode) => n.nodeName !== 'switch');
				legalRule = regularTag[(parent as INode).nodeName].legalChildElements;
			}

			for (let i = node.childNodes.length; i--;) {
				const childNode = node.childNodes[i];
				// 只针对 tag 类的子节点作处理
				if (!isTag(childNode)) {
					continue;
				}

				if (noself && childNode.nodeName === node.nodeName) { // 不允许嵌套自身
					rmNode(childNode);
				} else if (legalRule.any) {
					// any 表示可以任意嵌套
					continue;
				} else if (legalRule.childElements && legalRule.childElements.indexOf(childNode.nodeName) === -1) { // 不在嵌套列表中的情况
					rmNode(childNode);
				}
			}
		}, dom, true);
	}
	resolve();
});
