import { Rule, StyleRules } from 'css';
import { has } from 'ramda';
import { createShortenID } from '../algorithm/create-shorten-id';
import { mixWhiteSpace } from '../utils/mix-white-space';
import { traversalObj } from '../utils/traversal-obj';
import { isTag } from '../xml/is-tag';
import { traversalNode } from '../xml/traversal-node';

const classSelectorReg = /\.([^,\*#>+~:{\s\[\.]+)/gi;

// [原始 className]: [短 className, 是否被引用过]
interface IClassList {
	[propName: string]: [string, boolean];
}

export const shortenClass = async (rule: TConfigItem[], dom: IDomNode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		const parsedCss = dom.stylesheet;
		if (parsedCss) {
			let si = 0;
			const classList: IClassList = {};
			const shorten = (key: string) => {
				if (classList.hasOwnProperty(key)) {
					return classList[key][0];
				}
				const sid = createShortenID(si++);
				classList[key] = [sid, false];
				return sid;
			};

			// 取出所有被引用的 class ，并缩短
			const cssRules: StyleRules = parsedCss.stylesheet as StyleRules;
			traversalObj(has('selectors'), (ruleItem: Rule) => {
				const selectors = ruleItem.selectors;
				if (selectors) {
					selectors.forEach((selector: string, selectorIndex) => {
						selectors[selectorIndex] = selector.replace(classSelectorReg, (m, p: string) => `.${shorten(p)}`);
					});
				}
			}, cssRules.rules);

			// 查找 dom 树，找到被引用的 class ，替换为缩短后的值
			traversalNode(isTag, node => {
				const classAttr = node.getAttribute('class');
				if (classAttr !== null) {
					const className = mixWhiteSpace(classAttr.trim()).split(/\s+/);

					for (let ci = className.length; ci--;) {
						if (classList.hasOwnProperty(className[ci])) {
							const cName = classList[className[ci]][0];
							classList[className[ci]][1] = true;
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
				if (item[1]) {
					return;
				}
				const reg = new RegExp(`\\.${item[0]}(?=[,\\*#>+~:{\\s\\[\\.]|$)`);
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
			});
		} else {
			// 如果不存在样式表，则直接移除所有的 class 属性
			traversalNode(isTag, node => {
				node.removeAttribute('class');
			}, dom);
		}
	}
	resolve();
});
