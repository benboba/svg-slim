import { Declaration, Node, Rule, StyleRules } from 'css';
import { propEq } from 'ramda';
import { IRuleOption } from '../../typings';
import { IDom } from '../../typings/node';
import { regularAttr } from '../const/regular-attr';
import { traversalObj } from '../utils/traversal-obj';
import { knownCSS } from '../validate/known-css';
import { valueIsEqual } from '../xml/attr-is-equal';

const rmCSSNode = (cssNode: Node, plist: Node[]) => {
	const index = plist.indexOf(cssNode);
	if (index !== -1) {
		plist.splice(index, 1);
	}
};

export const rmIllegalStyle = async (dom: IDom, {
	params: {
		rmAttrEqDefault,
	},
}: IRuleOption): Promise<void> => new Promise(resolve => {
	if (dom.stylesheet) {
		const cssRules: StyleRules = dom.stylesheet.stylesheet as StyleRules;

		// 遍历 style 解析对象，取得包含 css 定义的值
		traversalObj<Declaration>(propEq('type', 'declaration'), (cssNode, parents) => {
			const attrDefine = regularAttr[cssNode.property as string];
			if (!attrDefine.couldBeStyle && !knownCSS(cssNode.property as string)) {
				rmCSSNode(cssNode, parents[parents.length - 1] as Rule[]);
			} else if (rmAttrEqDefault) {
				// 仅验证只有一种默认值的情况
				if (typeof attrDefine.initValue === 'string' && valueIsEqual(attrDefine, cssNode.value as string, attrDefine.initValue)) {
					rmCSSNode(cssNode, parents[parents.length - 1] as Rule[]);
				}
			}
		}, cssRules.rules, true);

	}
	resolve();
});
