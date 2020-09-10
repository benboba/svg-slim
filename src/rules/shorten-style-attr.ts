import { has, pipe } from 'ramda';
import { IRegularTag, IRuleOption, TUnique } from '../../typings';
import { IDom, ITag } from '../../typings/node';
import { animationAttrElements, animationAttributes } from '../const/definitions';
import { regularAttr } from '../const/regular-attr';
import { regularTag } from '../const/regular-tag';
import { checkApply } from '../style/check-apply';
import { parseStyle } from '../style/parse';
import { shortenStyle } from '../style/shorten';
import { stringifyStyle } from '../style/stringify';
import { hasProp } from '../utils/has-prop';
import { legalValue } from '../validate/legal-value';
import { attrIsEqual } from '../xml/attr-is-equal';
import { isTag } from '../xml/is-tag';
import { parseStyleTree } from '../xml/parse-style-tree';
import { NodeType } from 'svg-vdom';

// 属性转 style 的临界值
const styleThreshold = 4;
const style2value = pipe(stringifyStyle, shortenStyle);

// 一些元素的某些属性不能被转为 style
const cantTrans = (define: IRegularTag, attrName: string) => define.onlyAttr && define.onlyAttr.includes(attrName);

interface IStyleAttrObj {
	[prop: string]: {
		value: string;
		fromStyle?: boolean;
		onlyCss?: boolean;
		animateAttr?: string;
	};
}

const checkAttr = (node: ITag, dom: IDom, rmAttrEqDefault: boolean) => {
	parseStyleTree(dom);
	const attrObj: IStyleAttrObj = {}; // 存储所有样式和可以转为样式的属性
	const tagDefine = regularTag[node.nodeName];
	// 逆序循环，并从后向前移除属性
	for (let i = node.attributes.length; i--;) {
		const attr = node.attributes[i];
		const attrDefine = regularAttr[attr.fullname];
		if (attr.fullname === 'style') {
			const styleObj = parseStyle(attr.value);
			const styleUnique: TUnique = {};
			// 逆序循环，因为 CSS 的优先级是从后往前覆盖的
			for (let si = styleObj.length; si--;) {
				const styleItem = styleObj[si];
				const styleDefine = regularAttr[styleItem.fullname];
				if (
					!styleDefine.couldBeStyle // 不能做样式
					||
					styleUnique[styleItem.fullname] // 排重
					||
					!checkApply(styleDefine, node, dom) // 样式继承链上不存在可应用对象
				) {
					styleObj.slice(si, 1);
					continue;
				}

				// 标记一下是否存在不能和属性互转的样式
				const onlyCss = styleDefine.cantTrans || cantTrans(tagDefine, styleItem.fullname);

				// 如果存在同名属性，要把被覆盖的属性移除掉
				// 之所以要判断 attrObj 是否存在 key，是为了保证只移除已遍历过的属性（此处不考虑同名属性，同名属性无法通过 xml-parser 的解析规则）
				if (!onlyCss && has(styleItem.fullname, attrObj)) {
					node.removeAttribute(styleItem.fullname);
				}

				if (rmAttrEqDefault) {
					// 如果父元素上有同名的样式类属性，则不能移除和默认值相同的属性
					const parentStyle = (node.parentNode as ITag).styles;
					if (!styleDefine.inherited || !parentStyle || !hasProp(parentStyle, styleItem.fullname)) {
						if (attrIsEqual(styleDefine, styleItem.value, node.nodeName)) {
							styleObj.slice(si, 1);
							continue;
						}
					}
				}

				styleUnique[styleItem.fullname] = true;
				attrObj[styleItem.fullname] = {
					value: styleItem.value,
					fromStyle: true,
					onlyCss,
				};
			}

			if (styleObj.length) {
				attr.value = style2value(styleObj);
			} else {
				node.removeAttribute(attr.fullname);
			}
		} else if (attrDefine.couldBeStyle) {
			if (
				attrDefine.cantBeAttr // 有一些样式不能被设置为属性
			) {
				node.removeAttribute(attr.fullname);
				continue;
			}
			if (attrDefine.cantTrans || cantTrans(tagDefine, attr.fullname)) { // 有一些元素的某些属性不能被转为 style，此类属性也不宜再按照 css 属性来验证
				continue;
			}

			if (rmAttrEqDefault) {
				// 如果父元素上有同名的样式类属性，则不能移除和默认值相同的属性
				const parentStyle = (node.parentNode as ITag).styles;
				if (!attrDefine.inherited || !parentStyle || !hasProp(parentStyle, attr.fullname)) {
					if (attrIsEqual(attrDefine, attr.value, node.nodeName)) {
						node.removeAttribute(attr.fullname);
						continue;
					}
				}
			}

			// 如果样式无法应用到当前元素，且所有子元素都无法应用或已覆盖，则可以移除
			if (!attrDefine.applyTo.includes(node.nodeName) && attrDefine.inherited) {
				const subTags = node.childNodes.filter(subNode => isTag(subNode) && subNode.styles) as Required<ITag>[];
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
		} else {
			const attributeName = node.getAttribute('attributeName') || '';
			if (
				animationAttributes.includes(attr.fullname) // 动画属性 from、to、by、values
				&&
				animationAttrElements.includes(node.nodeName) // 存在于动画元素上
				&&
				attr.fullname !== 'values'
				&&
				attributeName
			) {
				const animateDefine = regularAttr[attributeName];
				if (animateDefine.couldBeStyle) {
					attrObj[attributeName] = {
						value: attr.value,
						animateAttr: attr.fullname,
					};
				}
			}
		}
	}

	// 只做基本验证
	Object.keys(attrObj).forEach(key => {
		const styleItem = attrObj[key];
		const styleDefine = regularAttr[key];
		if (!styleDefine.cantTrans && !legalValue(styleDefine, {
			fullname: key,
			value: styleItem.value,
			name: '',
		})) {
			styleItem.value = '';
		}
	});

	Object.entries(attrObj).forEach(([key, attrItem]) => {
		if (attrItem.animateAttr) { // 对于动画属性，验证完合法性后就应该移除缓存
			if (!attrItem.value) {
				node.removeAttribute(attrItem.animateAttr);
			}
			delete attrObj[key];
		} else {
			if (!attrItem.value) {
				delete attrObj[key];
				node.removeAttribute(key);
			}
		}
	});
	if (!Object.values(attrObj).some(val => val.fromStyle)) {
		node.removeAttribute('style');
	}

	// 进行动画属性的合法性验证
	return attrObj;
};

export const shortenStyleAttr = async (dom: IDom, {
	params: {
		exchangeStyle,
		rmAttrEqDefault,
	}
}: IRuleOption): Promise<void> => new Promise(resolve => {
	const hasStyleTag = !!dom.styletag;

	const tags = dom.querySelectorAll(NodeType.Tag) as ITag[];
	tags.forEach(node => {
		const attrObj = checkAttr(node, dom, rmAttrEqDefault);
		// TODO css all 属性命中后要清空样式
		// TODO 连锁属性的判断
		if (!hasStyleTag || exchangeStyle) {
			// [warning] svg 的样式覆盖规则是 style 属性 > style 标签 > 属性，所以以下代码可能导致不正确的样式覆盖！
			// 如果存在只能放在 css 中的属性，则强制属性转 style @v1.5.0+
			if (Object.values(attrObj).some(val => val.onlyCss) || Object.keys(attrObj).length > styleThreshold) {

				// 属性转 style
				Object.entries(attrObj).forEach(([key, val]) => {
					if (!val.onlyCss) {
						node.removeAttribute(key);
					}
				});
				// 执行一次 reverse 把顺序反转过来
				node.setAttribute('style', style2value(Object.keys(attrObj).reverse().map(key => {
					return {
						name: key,
						fullname: key,
						value: attrObj[key].value,
					};
				})));

			} else {
				// style 转属性
				node.removeAttribute('style');
				// 执行一次 reverse 把顺序反转过来
				Object.keys(attrObj).reverse().forEach(name => {
					node.setAttribute(name, attrObj[name].value);
				});
			}
		}
	});
	resolve();
});
