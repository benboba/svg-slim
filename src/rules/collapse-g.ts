import type { IAttr, IDocument, IParentNode, ITagNode } from 'svg-vdom';
import type { TDynamicObj } from '../../typings';
import { ITag } from '../../typings/node';
import { IStyleAttr } from '../../typings/style';
import { cantCollapseAttributes, transformAttributes } from '../const/definitions';
import { regularAttr } from '../const/regular-attr';
import { checkApply } from '../style/check-apply';
import { parseStyle } from '../style/parse';
import { styleToValue } from '../style/style-to-value';
import { hasProp } from '../utils/has-prop';
import { parseStyleTree } from '../xml/parse-style-tree';

type TAttrObj = TDynamicObj<IAttr>;

const collapseAttributes = (node1: ITagNode, node2: ITagNode) => {
	const attrObj: TAttrObj = {};
	node1.attributes.forEach(attr => {
		attrObj[attr.fullname] = attr;
	});
	node2.attributes.forEach(attr => {
		if (hasProp(attrObj, attr.fullname)) {
			if (transformAttributes.includes(attr.fullname)) {
				attrObj[attr.fullname].value = `${attr.value} ${attrObj[attr.fullname].value}`;
			}
		} else {
			node1.setAttribute(attr.name, attr.value, attr.namespace);
			attrObj[attr.fullname] = attr;
		}
	});
};

const checkStyleTrans = (dom: IDocument, node: ITagNode) => {
	parseStyleTree(dom);
	const styleAttr = node.getAttribute('style');
	if (styleAttr) {
		const styleList = parseStyle(styleAttr);
		const transStyleList = new Map<ITagNode, IStyleAttr>();
		for (let si = styleList.length; si--;) {
			const styleItem = styleList[si];
			const styleDefine = regularAttr[styleItem.fullname];
			// 只要有一个样式可应用，就中断验证
			if (styleDefine.applyTo.includes('g')) {
				return;
			}
			// 获取样式可生效的子元素列表（判断依据是可被应用，并且样式来自于继承）
			const affectChildren = node.children.filter((child: ITag) => checkApply(styleDefine, child, dom) && child.styles?.[styleItem.fullname]?.from === 'inherit');
			// 无可应用的子元素，跳过
			if (affectChildren.length === 0) continue;
			// 只有一个子元素可应用，标记迁移
			if (affectChildren.length === 1) {
				transStyleList.set(affectChildren[0], styleItem);
				continue;
			}
			// 只要有一个样式对多个子元素生效，就中断验证
			return;
		}

		for (const [childNode, styleItem] of transStyleList) {
			const childStyle = parseStyle(childNode.getAttribute('style') ?? '');
			// 因为是继承的，所以移除 important
			styleItem.important = false;
			childStyle.push(styleItem);
			childNode.setAttribute('style', styleToValue(childStyle));
		}
		node.removeAttribute('style');
	}
};

// 包含某些特定属性，不允许进行塌陷
const cantCollapse = (node: ITagNode) => node.attributes.filter(attr => cantCollapseAttributes.includes(attr.fullname)).length;

export const collapseG = async (dom: IDocument): Promise<void> => new Promise(resolve => {
	const gTags = dom.querySelectorAll('g') as ITagNode[];
	for (let i = gTags.length; i--;) {
		const node = gTags[i];
		const children = node.children;
		if (!children.length) {
			node.remove();
			continue;
		}

		checkStyleTrans(dom, node);

		if (!cantCollapse(node)) {
			if (children.length === 1) { // 只有一个子节点
				const childNode = children[0] as ITagNode;
				collapseAttributes(childNode, node);
				(node.parentNode as IParentNode).replaceChild(childNode, node);
			} else if (!node.attributes.length) { // 没有属性
				(node.parentNode as IParentNode).replaceChild(children, node);
			}
		}
	}
	resolve();
});
