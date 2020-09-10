import { any, both, equals, not, prop } from 'ramda';
import { IDocument, ITagNode } from 'svg-vdom';
import { IRuleOption } from '../../typings';
import { regularTag } from '../const/regular-tag';
import { isTag } from '../xml/is-tag';

export const rmIrregularNesting = async (dom: IDocument, {
	option: { ignore }
}: IRuleOption): Promise<void> => new Promise(resolve => {
	const notIgnore = (node: ITagNode) => not(any(equals(prop('nodeName', node)), ignore as string[]));
	const tags = dom.querySelectorAll(both(isTag, notIgnore)) as ITagNode[];

	tags.forEach(node => {
		let legalRule = regularTag[node.nodeName].legalChildElements;
		// noself 表示不允许嵌套自身
		const noself = legalRule.noself;

		// transparent 表示参照最近的非 switch 上级元素的规则
		if (legalRule.transparent) {
			const parent = (node.parentNode as ITagNode).closest(n => n.nodeName !== 'switch') as ITagNode;
			legalRule = regularTag[parent.nodeName].legalChildElements;
		}

		for (let i = node.childNodes.length; i--;) {
			const childNode = node.childNodes[i];
			// 只针对 tag 类的子节点作处理
			if (!isTag(childNode)) {
				continue;
			}

			if (noself && childNode.nodeName === node.nodeName) { // 不允许嵌套自身
				childNode.remove();
			} else if (legalRule.any) {
				// any 表示可以任意嵌套
				continue;
			} else if (legalRule.childElements && !legalRule.childElements.includes(childNode.nodeName)) { // 不在嵌套列表中的情况
				childNode.remove();
			}
		}
	});
	resolve();
});
