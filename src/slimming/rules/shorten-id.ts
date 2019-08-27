import { parse as cssParse, stringify as cssStringify, Stylesheet, StyleRules } from 'css';
import { INode } from '../../node/index';
import { createShortenID } from '../algorithm/create-shorten-id';
import { TConfigItem } from '../config/config';
import { regularAttr } from '../const/regular-attr';
import { funcIRIToID, IRIFullMatch } from '../const/syntax';
import { IExtendRule } from '../interface/extend-rule';
import { ITagNode } from '../interface/node';
import { shortenTag } from '../style/shorten-tag';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

const idSelectorReg = /#([^,\*#>+~:{\s\[\.]+)/gi;

// [原始 id]: [短 id, 所属节点, 唯一 key]
interface IIDCache {
	[propName: string]: [string, INode, string | null];
}

export const shortenID = async (rule: TConfigItem[], dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		const IDList: IIDCache = {};
		let si = 0;
		let cssNode: INode;
		let cssContent: INode;
		let parsedCss: Stylesheet;
		let cssRules: StyleRules;

		const shorten = (node: INode, attrname: string | null, key: string) => {
			if (IDList.hasOwnProperty(key)) {
				return IDList[key][0];
			}
			const sid = createShortenID(si++);
			IDList[key] = [sid, node, attrname];
			return sid;
		};

		// 首先取出所有被引用的 ID ，并缩短
		traversalNode<ITagNode>(isTag, node => {
			if (node.nodeName === 'style') {
				cssNode = node;
				cssContent = node.childNodes[0];
				try {
					parsedCss = cssParse(cssContent.textContent as string, { silent: true });
					cssRules = parsedCss.stylesheet as StyleRules;
					cssRules.rules.forEach((item: IExtendRule) => {
						if (item.type === 'rule' && item.selectors) {
							const selectors = item.selectors;
							selectors.forEach((selector, selectorIndex) => {
								selectors[selectorIndex] = selector.replace(idSelectorReg, (m, p: string) => `#${shorten(node, null, p)}`);
							});
						}
					});
					cssContent.textContent = shortenTag(cssStringify(parsedCss, { compress: true }));
				} catch (e) {
					rmNode(cssNode);
				}

			} else {
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
			}
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
				for (let ri = cssRules.rules.length; ri--;) {
					const cssRule: IExtendRule = cssRules.rules[ri];
					if (cssRule.selectors) {
						for (let i = cssRule.selectors.length; i--;) {
							if (reg.test(cssRule.selectors[i])) {
								cssRule.selectors.splice(i, 1);
							}
						}
						if (!cssRule.selectors.length) {
							cssRules.rules.splice(ri, 1);
						}
					}
				}
				if (cssRules.rules.length) {
					cssContent.textContent = shortenTag(cssStringify(parsedCss, { compress: true }));
				} else {
					rmNode(cssNode);
				}
			}
		});
	}
	resolve();
});
