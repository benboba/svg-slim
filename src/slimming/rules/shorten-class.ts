import { parse as parseCss, stringify as cssStringify, Stylesheet, StyleRules } from 'css';
import { propEq } from 'ramda';
import { INode } from '../../node/index';
import { createShortenID } from '../algorithm/create-shorten-id';
import { ConfigItem } from '../config/config';
import { IExtendRule } from '../interface/extend-rule';
import { shortenTag } from '../style/shorten-tag';
import { mixWhiteSpace } from '../utils/mix-white-space';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';
import { ITagNode } from '../interface/node';

const classSelectorReg = /\.([^,\*#>+~:{\s\[\.]+)/gi;

interface IClassList {
	[propName: string]: [string, number, boolean];
}

export const shortenClass = async (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		const classList: IClassList = {};
		let si = 0;
		let cssNode: INode;
		let cssContent: INode;
		let parsedCss: Stylesheet;
		let cssRules: StyleRules | undefined;

		const shorten = (key: string, rid: number) => {
			if (classList.hasOwnProperty(key)) {
				return classList[key][0];
			}
			const sid = createShortenID(si++);
			classList[key] = [sid, rid, false];
			return sid;
		};

		// 首先取出所有被引用的 class ，并缩短
		traversalNode<ITagNode>(propEq('nodeName', 'style'), node => {
			cssNode = node;
			cssContent = node.childNodes[0];
			parsedCss = parseCss(cssContent.textContent as string, { silent: true });
			cssRules = parsedCss.stylesheet;

			if (cssRules) {
				cssRules.rules.forEach((item: IExtendRule) => {
					if (item.type === 'rule' && item.selectors) {
						const selectors = item.selectors;
						const ruleId = +new Date();
						item.ruleId = ruleId;
						selectors.forEach((selector, selectorIndex) => {
							selectors[selectorIndex] = selector.replace(classSelectorReg, (m, p: string) => `.${shorten(p, ruleId)}`);
						});
					}
				});
				cssContent.textContent = shortenTag(cssStringify(parsedCss, { compress: true }));
			}
		}, dom);

		// 查找 dom 树，找到被引用的 class ，替换为缩短后的值
		traversalNode(isTag, node => {
			const classAttr = node.getAttribute('class');
			if (classAttr !== null) {
				const className = mixWhiteSpace(classAttr.trim()).split(/\s/);

				for (let ci = className.length; ci--; ) {
					if (classList.hasOwnProperty(className[ci])) {
						const cName = classList[className[ci]][0];
						classList[className[ci]][2] = true;
						className[ci] = cName;
					} else {
						className.splice(ci, 1);
					}
				}
				if (className.length) {
					node.setAttribute('class', className.join(' '));
				} else {
					node.removeAttribute('class');
				}
			}
		}, dom);

		// 最后移除不存在的 class 引用
		Object.values(classList).forEach(item => {
			if (item[2] || !cssRules) {
				return;
			}
			const reg = new RegExp(`.${item[0]}(?=[,\\*#>+~:{\\s\\[\\.]|$)`);
			for (let ri = cssRules.rules.length; ri--; ) {
				const cssRule: IExtendRule = cssRules.rules[ri];
				if (cssRule.ruleId === item[1] && cssRule.selectors) {
					for (let i = cssRule.selectors.length; i--; ) {
						if (reg.test(cssRule.selectors[i])) {
							cssRule.selectors.splice(i, 1);
						}
					}
					if (!cssRule.selectors.length) {
						cssRules.rules.splice(ri, 1);
					}
					break;
				}
			}
			if (cssRules.rules.length) {
				cssContent.textContent = shortenTag(cssStringify(parsedCss, { compress: true }));
			} else {
				rmNode(cssNode);
			}
		});
	}
	resolve();
});
