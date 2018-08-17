import { parse as cssParse, stringify as cssStringify } from 'css';
import { INode } from '../../node/index';
import { createShortenID } from '../algorithm/create-shorten-id';
import { regularAttr } from '../const/regular-attr';
import { shortenTag } from '../style/shorten-tag';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

const funciriReg = /^url\((["']?)#(.+)\1\)$/;
const iriReg = /^#(.+)$/;
const idSelectorReg = /#([^,\*#>+~:{\s\[\.]+)/gi;

export const shortenID = (rule, dom) => new Promise((resolve, reject) => {
	if (rule[0]) {
		const IDList = {};
		let si = 0;
		let cssNode: INode;
		let cssContent: INode;
		let parsedCss = null;

		const shorten = (node, attrname, key) => {
			if (IDList[key]) {
				return IDList[key][0];
			}
			const sid = createShortenID(si++);
			IDList[key] = [sid, node, attrname];
			return sid;
		};

		// 首先取出所有被引用的 ID ，并缩短
		traversalNode(isTag, (node: INode) => {
			if (node.nodeName === 'style') {
				cssNode = node;
				cssContent = node.childNodes[0];
				parsedCss = cssParse(cssContent.textContent, { silent: true });

				if (parsedCss) {
					parsedCss.stylesheet.rules.forEach(item => {
						if (item.type === 'rule') {
							item.ruleId = +new Date();
							item.selectors.forEach((selector, selectorIndex) => {
								item.selectors[selectorIndex] = selector.replace(idSelectorReg, (m, p) => `#${shorten(node, item.ruleId, p)}`);
							});
						}
					});
					cssContent.textContent = shortenTag(cssStringify(parsedCss, { compress: true }));
				}

			} else {
				node.attributes.forEach(attr => {
					if (regularAttr[attr.fullname].maybeFuncIRI) {
						const firi = funciriReg.exec(attr.value);
						if (firi) {
							attr.value = `url(#${shorten(node, attr.fullname, firi[2])})`;
						}
					} else if (regularAttr[attr.fullname].maybeIRI) {
						const iri = iriReg.exec(attr.value);
						if (iri) {
							attr.value = `#${shorten(node, attr.fullname, iri[1])}`;
						}
					}
				});
			}
		}, dom);

		// 查找 dom 树，找到被引用的 ID ，替换为缩短后的值
		traversalNode(isTag, (node: INode) => {
			for (let i = node.attributes.length; i--; ) {
				const attr = node.attributes[i];
				if (attr.fullname === 'id') {
					if (IDList[attr.value]) {
						const id = IDList[attr.value][0];
						delete IDList[attr.value];
						attr.value = id;
					} else {
						node.removeAttribute(attr.fullname);
					}
					break;
				}
			}
		}, dom);

		// 最后移除不存在的 ID 引用
		Object.values(IDList).forEach(item => {
			if (item[1]) {
				if (typeof item[2] === 'string') {
					(item[1] as INode).removeAttribute(item[2]);
				} else {
					const reg = new RegExp(`#${item[0]}(?=[,\\*#>+~:{\\s\\[\\.]|$)`);
					for (let ri = parsedCss.stylesheet.rules.length; ri--; ) {
						const cssRule = parsedCss.stylesheet.rules[ri];
						if (cssRule.ruleId === item[2]) {
							for (let i = cssRule.selectors.length; i--; ) {
								if (reg.test(cssRule.selectors[i])) {
									cssRule.selectors.splice(i, 1);
								}
							}
							if (!cssRule.selectors.length) {
								parsedCss.stylesheet.rules.splice(ri, 1);
							}
							break;
						}
					}
					if (parsedCss.stylesheet.rules.length) {
						cssContent.textContent = shortenTag(cssStringify(parsedCss, { compress: true }));
					} else {
						rmNode(cssNode);
					}
				}
			}
		});
	}
	resolve();
});