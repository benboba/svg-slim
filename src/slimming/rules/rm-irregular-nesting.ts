import { any, both, equals, not, prop } from 'ramda';
import { regularTag } from '../const/regular-tag';
import { getAncestor } from '../xml/get-ancestor';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

export const rmIrregularNesting = async (dom: IDomNode, { option: { ignore } }: IRuleOption<{ ignore: string[] }>): Promise<void> => new Promise(resolve => {
	const notIgnore = (node: ITagNode) => not(any(equals(prop('nodeName', node)), ignore));
	traversalNode<ITagNode>(both(isTag, notIgnore), node => {
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
			} else if (legalRule.childElements && !legalRule.childElements.includes(childNode.nodeName)) { // 不在嵌套列表中的情况
				rmNode(childNode);
			}
		}
	}, dom, true);
	resolve();
});
