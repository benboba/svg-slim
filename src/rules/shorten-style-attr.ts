import { NodeType } from 'svg-vdom';
import { IRegularTag, IRuleOption } from '../../typings';
import { IDom, ITag } from '../../typings/node';
import { regularAttr } from '../const/regular-attr';
import { regularTag } from '../const/regular-tag';
import { checkGeometry } from '../style/check-geometry';
import { parseStyle } from '../style/parse';
import { styleToValue } from '../style/style-to-value';
import { hasProp } from '../utils/has-prop';
import { parseStyleTree } from '../xml/parse-style-tree';

// 属性转 style 的临界值
const styleThreshold = 4;

// 一些元素的某些属性不能被转为 style
const cantTrans = (define: IRegularTag, attrName: string) => define.onlyAttr && define.onlyAttr.includes(attrName);

interface IStyleAttrObj {
	[prop: string]: {
		value: string;
		fromStyle?: boolean;
		onlyCss?: boolean;
	};
}

const checkAttr = (node: ITag, dom: IDom, rmAttrEqDefault: boolean, browsers: Record<string, number>) => {
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
			// 逆序循环，因为 CSS 的优先级是从后往前覆盖的
			for (let si = styleObj.length; si--;) {
				const styleItem = styleObj[si];
				const styleDefine = regularAttr[styleItem.fullname];

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

				attrObj[styleItem.fullname] = {
					value: styleItem.value,
					fromStyle: true,
					onlyCss,
				};
			}

		} else if (attrDefine.couldBeStyle || checkGeometry(node.nodeName, attr.fullname, browsers)) {
			if (cantTrans(tagDefine, attr.fullname)) { // 有一些元素的某些属性不能被转为 style，此类属性也不宜再按照 css 属性来验证
				continue;
			}

			// 虽然这里没有移除逻辑了，但是此处不应出现覆盖 style 导致 bug 的问题
			if (!hasProp(attrObj, attr.fullname)) {
				attrObj[attr.fullname] = {
					value: attr.value,
				};
			}
				
		}
	}

	return attrObj;
};

export const shortenStyleAttr = async (dom: IDom, {
	params: {
		rmAttrEqDefault,
		exchangeStyle,
	},
	browsers,
}: IRuleOption): Promise<void> => new Promise(resolve => {
	const hasStyleTag = !!dom.styletag;
	const tags = dom.querySelectorAll(NodeType.Tag) as ITag[];
	tags.forEach(node => {
		const attrObj = checkAttr(node, dom, rmAttrEqDefault, browsers);
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
				node.setAttribute('style', styleToValue(Object.keys(attrObj).reverse().map(key => {
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
