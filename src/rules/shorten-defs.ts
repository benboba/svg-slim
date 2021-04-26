import { IAttr, IDocument, ITagNode, NodeType } from 'svg-vdom';
import { TAttrObj } from '../../typings';
import { ITag } from '../../typings/node';
import { IStyleObj } from '../../typings/style';
import { checkAnimateMotion } from '../animate/check-animate-motion';
import { shapeElements } from '../const/definitions';
import { regularAttr } from '../const/regular-attr';
import { funcIRIToID, IRIFullMatch } from '../const/syntax';
import { parseStyle } from '../style/parse';
import { stringifyStyle } from '../style/stringify';
import { isTag } from '../xml/is-tag';
import { parseStyleTree } from '../xml/parse-style-tree';

interface IIDCacheITem {
	tag?: ITag; // 具有该 id 的节点
	iri: Array<[ITag, string]>; // [引用节点, 引用属性]
}

interface IIDCache {
	[propName: string]: IIDCacheITem | undefined;
}

const checkSub = (node: ITag, IDList: IIDCache, isDefs = false) => {
	let hasId = false;
	if (!isDefs) {
		const id = node.getAttribute('id');
		if (id) {
			if (IDList[id]) {
				hasId = true;
				(IDList[id] as IIDCacheITem).tag = node;
			}
		}
	}
	if (!hasId) {
		for (let ci = node.childNodes.length; ci--;) {
			const childNode = node.childNodes[ci];
			if (isTag(childNode)) {
				checkSub(childNode, IDList);
			} else {
				childNode.remove();
			}
		}
		if (!node.childNodes.length) {
			node.remove();
		} else if (!isDefs) {
			(node.parentNode as ITagNode).replaceChild(node.childNodes, node);
		}
	}
};

const checkDefsApply = (item: IIDCacheITem, dom: IDocument) => {
	const [node, attrName] = item.iri[0];
	// 只有 href 和 xlink:href 才能应用
	if (attrName !== 'href' && attrName !== 'xlink:href') {
		return;
	}
	switch (node.nodeName) {
		case 'use': {
			// TODO 有 x 和 y 的暂不做应用（实际效果应该相当于 translate，待验证）
			if (node.hasAttribute('x') || node.hasAttribute('y')) {
				return;
			}
			// 具有 viewport ，且 use 定义了宽高，不进行应用
			if (['svg', 'symbol'].includes((item.tag as ITagNode).nodeName) && (node.hasAttribute('width') || node.hasAttribute('height'))) {
				return;
			}
			const originStyle: TAttrObj = {};
			const originAttr: TAttrObj = {};
			for (const [key, val] of Object.entries(node.styles as IStyleObj)) {
				// 如果 use 元素被 style 命中，不能进行应用
				if (val.from === 'styletag') {
					return;
				}
				if (val.from === 'attr') {
					originAttr[key] = val.value;
				}
				if (val.from === 'inline') {
					originStyle[key] = val.value;
				}
			}
			const useTag = item.tag as ITag;
			(node.parentNode as ITag).replaceChild(useTag, node);
			const styleList: IAttr[] = useTag.hasAttribute('style') ? parseStyle(useTag.getAttribute('style') as string) : [];
			for (const [key, val] of Object.entries(originAttr)) {
				if (!useTag.hasAttribute(key) && !styleList.some(sItem => sItem.fullname === key)) {
					useTag.setAttribute(key, val);
				}
			}
			for (const [key, val] of Object.entries(originStyle)) {
				if (!useTag.hasAttribute(key) && !styleList.some(sItem => sItem.fullname === key)) {
					styleList.push({
						name: key,
						fullname: key,
						value: val,
					});
				}
			}
			if (styleList.length) {
				useTag.setAttribute('style', stringifyStyle(styleList));
			}
			return;
		}
		case 'mpath': {
			const pathTag = item.tag as ITagNode;
			const mpathParent = node.parentNode as ITagNode;
			if (!shapeElements.includes(pathTag.nodeName)) {
				node.remove();
				pathTag.remove();
				if (!checkAnimateMotion(mpathParent, dom)) {
					mpathParent.remove();
				}
				return;
			}
			// 只针对路径元素进行应用
			if (pathTag.nodeName === 'path') {
				const d = pathTag.getAttribute('d');
				if (d) {
					mpathParent.setAttribute('path', d);
					node.remove();
					pathTag.remove();
				}
			}
			return;
		}
		default:
			break;
	}
};

export const shortenDefs = async (dom: IDocument): Promise<void> => new Promise(resolve => {
	let firstDefs: ITagNode | undefined;

	// 首先合并 defs 标签
	(dom.querySelectorAll('defs') as ITagNode[]).forEach(node => {
		if (firstDefs) {
			firstDefs.appendChild(node.childNodes.filter(isTag));
			node.remove();
		} else {
			firstDefs = node;
			for (let ci = node.childNodes.length; ci--;) {
				const childNode = node.childNodes[ci];
				// 只保留标签类的子元素
				if (!isTag(childNode)) {
					childNode.remove();
				}
			}
		}
	});

	if (firstDefs) {
		// 取出所有被引用的 ID
		const IDList: IIDCache = {};
		(dom.querySelectorAll(isTag) as ITagNode[]).forEach(node => {
			node.attributes.forEach(attr => {
				if (regularAttr[attr.fullname].maybeFuncIRI) {
					const firi = funcIRIToID.exec(attr.value);
					if (firi) {
						if (!IDList[firi[2]]) {
							IDList[firi[2]] = {
								iri: [],
							};
						}
						(IDList[firi[2]] as IIDCacheITem).iri.push([node, attr.fullname]);
					}
				} else if (regularAttr[attr.fullname].maybeIRI) {
					const iri = IRIFullMatch.exec(attr.value);
					if (iri) {
						if (!IDList[iri[1]]) {
							IDList[iri[1]] = {
								iri: [],
							};
						}
						(IDList[iri[1]] as IIDCacheITem).iri.push([node, attr.fullname]);
					}
				}
			});
		});

		checkSub(firstDefs, IDList, true);
		parseStyleTree(dom);

		(Object.values(IDList) as IIDCacheITem[]).forEach(item => {
			if (item.tag) {
				// 有可能引用对象存在于 defs 内部，并且已被移除
				for (let i = item.iri.length; i--;) {
					const [tag] = item.iri[i];
					// 判断是否已从文档中移除
					if (!tag.closest(NodeType.Document)) {
						item.iri.splice(i, 1);
					}
				}
				if (!item.iri.length) {
					item.tag.remove();
				}

				if (item.iri.length === 1) {
					checkDefsApply(item, dom);
				}
			}
		});

		// 当 defs 没有子元素后，进行移除
		if (!firstDefs.childNodes.length) {
			firstDefs.remove();
		}
	}
	resolve();
});
