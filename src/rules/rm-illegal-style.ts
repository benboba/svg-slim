import { Declaration, Node, Rule, StyleRules } from 'css';
import { has, propEq } from 'ramda';
import { NodeType } from 'svg-vdom';
import { IRegularTag, IRuleOption } from '../../typings';
import { IDom, ITag } from '../../typings/node';
import { needUnitInStyle } from '../const/definitions';
import { regularAttr } from '../const/regular-attr';
import { regularTag } from '../const/regular-tag';
import { numberFullMatch } from '../const/syntax';
import { checkApply } from '../style/check-apply';
import { checkGeometry } from '../style/check-geometry';
import { parseStyle } from '../style/parse';
import { styleToValue } from '../style/style-to-value';
import { hasProp } from '../utils/has-prop';
import { traversalObj } from '../utils/traversal-obj';
import { knownCSS } from '../validate/known-css';
import { legalValue } from '../validate/legal-value';
import { attrIsEqual, valueIsEqual } from '../xml/attr-is-equal';
import { isTag } from '../xml/is-tag';
import { parseStyleTree } from '../xml/parse-style-tree';

const rmCSSNode = (cssNode: Node, plist: Node[]) => {
	const index = plist.indexOf(cssNode);
	if (index !== -1) {
		plist.splice(index, 1);
	}
};

// 一些元素的某些属性不能被转为 style
const cantTrans = (define: IRegularTag, attrName: string) => define.onlyAttr && define.onlyAttr.includes(attrName);

// 需要 px 单位但拿到了非 0 的纯数值
const checkUnit = (name: string, value: string) => needUnitInStyle.includes(name) && numberFullMatch.test(value) && +value !== 0;

interface IStyleAttrObj {
	[prop: string]: {
		value: string;
		fromStyle?: boolean;
	};
}

const checkAttr = (node: ITag, dom: IDom, rmAttrEqDefault: boolean, ignoreKnownCSS: boolean, browsers: Record<string, number>) => {
	parseStyleTree(dom);
	const attrObj: IStyleAttrObj = {}; // 存储所有样式和可以转为样式的属性
	const tagDefine = regularTag[node.nodeName];
	const nodeStyle = node.styles;
	// 标记覆盖了 styletag 中的属性
	// 逆序循环，并从后向前移除属性
	for (let i = node.attributes.length; i--;) {
		const attr = node.attributes[i];
		const attrDefine = regularAttr[attr.fullname];
		if (attr.fullname === 'style') {
			const styleObj = parseStyle(attr.value);
			const styleUnique = new Set<string>();
			// 逆序循环，因为 CSS 的优先级是从后往前覆盖的
			for (let si = styleObj.length; si--;) {
				const styleItem = styleObj[si];
				const styleDefine = regularAttr[styleItem.fullname];
		
				// 首先排重
				if (styleUnique.has(styleItem.fullname)) {
					styleObj.splice(si, 1);
					continue;
				}
		
				// 移除掉不能识别的 CSS 属性
				if (!styleDefine.couldBeStyle) {
					if (!knownCSS(styleItem.fullname) || ignoreKnownCSS) {
						styleObj.splice(si, 1);
					} else {
						styleUnique.add(styleItem.fullname);
						// 不在 SVG attributes 列表里的标准 CSS 属性不再验证合法性，但仍然需要排重
					}
					continue;
				}
		
				// 样式继承链上不存在可应用对象
				if (!checkApply(styleDefine, node, dom)) {
					styleObj.splice(si, 1);
					continue;
				}
		
				if (!legalValue(styleDefine, styleItem)) {
					styleObj.splice(si, 1);
					continue;
				}

				// 需要 px 单位，但是没有加 px
				if (checkUnit(styleItem.fullname, styleItem.value)) {
					styleObj.splice(si, 1);
					continue;
				}

				if (rmAttrEqDefault) {
					// 如果父元素上有同名的样式类属性，则不能移除和默认值相同的属性
					const parentStyle = (node.parentNode as ITag).styles;
					const nodeStyle = node.styles;
					// 当前样式不是覆盖的 styletag， 才可以移除
					if (!styleDefine.inherited || !parentStyle || !hasProp(parentStyle, styleItem.fullname)) {
						if ((!nodeStyle || !nodeStyle[styleItem.fullname] || !nodeStyle[styleItem.fullname].override) && attrIsEqual(styleDefine, styleItem.value, node.nodeName)) {
							styleObj.splice(si, 1);
							continue;
						}
					}
				}
		
				styleUnique.add(styleItem.fullname);
				// 标记一下是否存在不能和属性互转的样式
				const onlyCss = (nodeStyle && nodeStyle[styleItem.fullname] && nodeStyle[styleItem.fullname].override) // 属性覆盖了 styletag
				||
				(
					!styleDefine.couldBeStyle // 标记在常规属性列表中
					&&
					!checkGeometry(node.nodeName, styleItem.fullname, browsers) // 并且当前环境不支持 geo 属性转换
				)
				||
				cantTrans(tagDefine, styleItem.fullname); // 某些特定元素属性不能放在 style 中

				// 如果存在同名属性，要把被覆盖的属性移除掉
				// 之所以要判断 attrObj 是否存在 key，是为了保证只移除已遍历过的属性（此处不考虑同名属性，同名属性无法通过 svg-vdom 的解析规则）
				if (!onlyCss && has(styleItem.fullname, attrObj)) {
					node.removeAttribute(styleItem.fullname);
				}

				attrObj[styleItem.fullname] = {
					value: styleItem.value,
					fromStyle: true,
				};
			}

			if (styleObj.length) {
				node.setAttribute('style', styleToValue(styleObj));
			} else {
				node.removeAttribute('style');
			}
		} else if (attrDefine.couldBeStyle || checkGeometry(node.nodeName, attr.fullname, browsers)) {
			if (cantTrans(tagDefine, attr.fullname)) { // 有一些元素的某些属性不能被转为 style，此类属性也不宜再按照 css 属性来验证
				continue;
			}

			// 如果样式无法应用到当前元素，且所有子元素都无法应用或已覆盖，则可以移除
			if (!attrDefine.applyTo.includes(node.nodeName) && attrDefine.inherited) {
				const subTags = node.children as Required<ITag>[];
				if (subTags.length && subTags.every(subTag => subTag.styles[attr.fullname].from !== 'inherit' || !checkApply(attrDefine, subTag, dom))) {
					node.removeAttribute(attr.fullname);
					continue;
				}
			}

			if (
				hasProp(attrObj, attr.fullname) // 已被 style 属性覆盖
				||
				!checkApply(attrDefine, node, dom) // 样式继承链上不存在可应用对象
			) {
				node.removeAttribute(attr.fullname);
			} else {
				attrObj[attr.fullname] = {
					value: attr.value,
				};
			}
		}
	}
};

export const rmIllegalStyle = async (dom: IDom, {
	params: {
		rmAttrEqDefault,
		ignoreKnownCSS,
	},
	browsers,
}: IRuleOption): Promise<void> => new Promise(resolve => {
	if (dom.stylesheet) {
		const cssRules: StyleRules = dom.stylesheet.stylesheet as StyleRules;

		// 遍历 style 解析对象，取得包含 css 定义的值
		traversalObj<Declaration>(propEq('type', 'declaration'), (cssNode, parents) => {
			const attrDefine = regularAttr[cssNode.property as string];
			if (!attrDefine.couldBeStyle && (!knownCSS(cssNode.property as string) || ignoreKnownCSS) || checkUnit(cssNode.property as string, cssNode.value as string)) {
				rmCSSNode(cssNode, parents[parents.length - 1] as Rule[]);
			} else if (rmAttrEqDefault) {
				// 仅验证只有一种默认值的情况
				if (typeof attrDefine.initValue === 'string' && valueIsEqual(attrDefine, cssNode.value as string, attrDefine.initValue)) {
					rmCSSNode(cssNode, parents[parents.length - 1] as Rule[]);
				}
			}
		}, cssRules.rules, true);
	}

	parseStyleTree(dom);

	const tags = dom.querySelectorAll(NodeType.Tag) as ITag[];
	tags.forEach(node => {
		checkAttr(node, dom, rmAttrEqDefault, ignoreKnownCSS, browsers);
	});
	resolve();
});
