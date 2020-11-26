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

	for (let i = tags.length; i--;) {
		const node = tags[i];
		const parent = node.parentNode;
		if (!parent) {
			continue;
		}
		let legalRule = regularTag[parent.nodeName];

		if (legalRule.isUndef) {
			continue;
		}

		// noself 表示不允许嵌套自身
		if (legalRule.legalChildElements.noself && node.nodeName === parent.nodeName) {
			node.remove();
			continue;
		}

		// transparent 表示参照最近的非 switch 上级元素的规则
		if (legalRule.legalChildElements.transparent) {
			const ancestor = (parent.parentNode as ITagNode).closest(n => n.nodeName !== 'switch');
			if (!ancestor || !isTag(ancestor)) {
				continue;
			}
			legalRule = regularTag[ancestor.nodeName];
			if (legalRule.isUndef) {
				continue;
			}	
		}

		// any 表示可以任意嵌套
		if (legalRule.legalChildElements.any) {
			continue;
		} else if (legalRule.legalChildElements.childElements && !legalRule.legalChildElements.childElements.includes(node.nodeName)) { // 不在嵌套列表中的情况
			node.remove();
		}
	}
	resolve();
});
