import { has, pipe, propEq } from 'ramda';
import { onlyInCSS, onlyInAttr } from '../const/definitions';
import { regularAttr } from '../const/regular-attr';
import { checkApply } from '../style/check-apply';
import { execStyle } from '../style/exec';
import { shortenStyle } from '../style/shorten';
import { stringifyStyle } from '../style/stringify';
import { legalValue } from '../validate/legal-value';
import { isTag } from '../xml/is-tag';
import { traversalNode } from '../xml/traversal-node';

// 属性转 style 的临界值
const styleThreshold = 4;
const style2value = pipe(stringifyStyle, shortenStyle);

// 某些属性可能不宜转为 style 样式，待验证
const cantTrans = (nodeName: string, attrName: string) => {
	return onlyInAttr.hasOwnProperty(nodeName) ? onlyInAttr[nodeName as keyof typeof onlyInAttr].indexOf(attrName) !== -1 : false;
};

export const shortenStyleAttr = async (rule: TFinalConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		const { exchange } = rule[1] as { exchange: boolean };
		let hasStyleTag = false;

		traversalNode(propEq('nodeName', 'style'), () => {
			hasStyleTag = true;
		}, dom);

		traversalNode<ITagNode>(isTag, node => {
			const attrObj: IAttrObj = {};
			let hasOnlyInCSS = false;
			for (let i = node.attributes.length; i--;) {
				const attr = node.attributes[i];
				const attrDefine = regularAttr[attr.fullname];
				if (attr.fullname === 'style') {
					const styleObj = execStyle(attr.value);
					const styleUnique: IUnique = {};
					// 逆序循环，因为 CSS 的优先级是从后往前覆盖的
					for (let si = styleObj.length; si--;) {
						const styleItem = styleObj[si];
						const styleDefine = regularAttr[styleItem.fullname];
						if (
							styleUnique[styleItem.fullname] // 排重逻辑单独提前
						) {
							styleObj.splice(si, 1);
							continue;
						}
						// 有效果的 CSS3 属性要保留
						if (onlyInCSS.indexOf(styleItem.fullname) !== -1) {
							hasOnlyInCSS = true;
						} else if (
							!styleDefine.couldBeStyle // 不是合法的样式属性
							||
							!checkApply(styleDefine, node, dom) // 样式继承链上不存在可应用对象
							||
							!legalValue(styleDefine, styleItem, node.nodeName) // 值不合法
						) {
							styleObj.splice(si, 1);
							continue;
						}
						if (has(styleItem.fullname, attrObj)) { // 如果存在同名属性，要把被覆盖的属性移除掉
							node.removeAttribute(styleItem.fullname);
						}
						styleUnique[styleItem.fullname] = true;
						attrObj[styleItem.fullname] = styleItem.value;
					}

					if (styleObj.length) {
						attr.value = style2value(styleObj);
					} else {
						node.removeAttribute(attr.fullname);
					}
				} else if (attrDefine.couldBeStyle) {
					if (cantTrans(node.nodeName, attr.fullname)) {
						continue;
					}
					if (
						attrObj[attr.fullname] // 已被 style 属性覆盖
						||
						!checkApply(attrDefine, node, dom) // 样式继承链上不存在可应用对象
						||
						!legalValue(attrDefine, attr, node.nodeName) // 值不合法
					) {
						node.removeAttribute(attr.fullname);
					} else {
						attrObj[attr.fullname] = attr.value;
					}
				}
			}
			// TODO 连锁属性的判断
			if (!hasStyleTag || exchange) {
				// [warning] svg 的样式覆盖规则是 style 属性 > style 标签 > 属性，所以以下代码可能导致不正确的样式覆盖！
				// 如果存在只能放在 css 中的属性，则强制属性转 style @v1.5.0+
				if (hasOnlyInCSS || Object.keys(attrObj).length > styleThreshold) {

					// 属性转 style
					for (let j = node.attributes.length; j--;) {
						const attr = node.attributes[j];
						if (regularAttr[attr.fullname].couldBeStyle || attr.fullname === 'style') {
							node.removeAttribute(attr.fullname);
						}
					}
					node.setAttribute('style', style2value(Object.keys(attrObj).map(key => {
						return {
							name: key,
							fullname: key,
							value: attrObj[key],
						};
					})));

				} else {

					// style 转属性
					node.removeAttribute('style');
					node.attributes.forEach(attr => {
						if (has(attr.fullname, attrObj)) {
							// tslint:disable-next-line:no-dynamic-delete
							delete attrObj[attr.fullname];
						}
					});
					Object.keys(attrObj).forEach(name => {
						node.setAttribute(name, attrObj[name]);
					});

				}
			}
		}, dom);
	}
	resolve();
});
