import { Rule, StyleRules } from 'css';
import { has } from 'ramda';
import { createShortenID } from '../algorithm/create-shorten-id';
import { regularAttr } from '../const/regular-attr';
import { funcIRIToID, IRIFullMatch } from '../const/syntax';
import { traversalObj } from '../utils/traversal-obj';
import { isTag } from '../xml/is-tag';
import { traversalNode } from '../xml/traversal-node';

const idSelectorReg = /#([^,\*#>+~:{\s\[\.]+)/gi;

// [原始 id]: [短 id, 所属节点, 唯一 key]
interface IIDCache {
	[propName: string]: [string, INode, string | null];
}

export const shortenID = async (rule: TFinalConfigItem, dom: IDomNode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		let si = 0;
		const IDList: IIDCache = {};
		const shorten = (node: INode, attrname: string | null, key: string) => {
			if (IDList.hasOwnProperty(key)) {
				return IDList[key][0];
			}
			const sid = createShortenID(si++);
			IDList[key] = [sid, node, attrname];
			return sid;
		};

		let cssRules: StyleRules;

		// 取出 ID 选择器，并缩短
		if (dom.stylesheet) {
			cssRules = dom.stylesheet.stylesheet as StyleRules;
			traversalObj(has('selectors'), (ruleItem: Rule) => {
				const selectors = ruleItem.selectors;
				if (selectors) {
					selectors.forEach((selector: string, selectorIndex) => {
						selectors[selectorIndex] = selector.replace(idSelectorReg, (m, p: string) => `#${shorten(dom.styletag as ITagNode, null, p)}`);
					});
				}
			}, cssRules.rules);
		}

		// 取出所有被属性引用的 ID ，并缩短
		traversalNode<ITagNode>(isTag, node => {
			node.attributes.forEach(attr => {
				if (regularAttr[attr.fullname].maybeFuncIRI) {
					const firi = funcIRIToID.exec(attr.value);
					if (firi) {
						attr.value = `url(#${shorten(node, attr.fullname, firi[2])})`;
					}
				} else if (regularAttr[attr.fullname].maybeIRI) {
					const iri = IRIFullMatch.exec(attr.value);
					if (iri) {
						attr.value = `#${shorten(node, attr.fullname, iri[1])}`;
					}
				}
			});
		}, dom);

		// 查找 dom 树，找到被引用的 ID ，替换为缩短后的值
		traversalNode(isTag, (node: INode) => {
			const ID = node.getAttribute('id');
			if (ID !== null) {
				if (IDList.hasOwnProperty(ID)) {
					const id = IDList[ID][0];
					// tslint:disable-next-line:no-dynamic-delete
					delete IDList[ID];
					node.setAttribute('id', id);
				} else {
					node.removeAttribute('id');
				}
			}
		}, dom);

		// 最后移除不存在的 ID 引用
		Object.values(IDList).forEach(item => {
			if (typeof item[2] === 'string') {
				item[1].removeAttribute(item[2]);
			} else {
				const reg = new RegExp(`#${item[0]}(?=[,\\*#>+~:{\\s\\[\\.]|$)`);
				traversalObj(has('selectors'), (ruleItem: Rule, path) => {
					const selectors = ruleItem.selectors;
					if (selectors) {
						for (let i = selectors.length; i--;) {
							if (reg.test(selectors[i])) {
								selectors.splice(i, 1);
							}
						}
						if (!selectors.length) {
							const parent = path[path.length - 1] as Rule[];
							parent.splice(parent.indexOf(ruleItem), 1);
						}
					}
				}, cssRules.rules);
			}
		});
	}
	resolve();
});
