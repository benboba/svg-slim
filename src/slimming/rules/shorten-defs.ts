import { propEq } from 'ramda';
import { regularAttr } from '../const/regular-attr';
import { funcIRIToID, IRIFullMatch } from '../const/syntax';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';
import { getAncestor } from '../xml/get-ancestor';
import { execStyleTree } from '../xml/exec-style-tree';
import { execStyle } from '../style/exec';
import { stringifyStyle } from '../style/stringify';
import { shapeElements } from '../const/definitions';
import { checkAnimateMotion } from '../animate/check-animate-motion';

interface IIDCacheITem {
	tag?: ITagNode; // 具有该 id 的节点
	iri: Array<[ITagNode, string]>; // [引用节点, 引用属性]
}

interface IIDCache {
	[propName: string]: IIDCacheITem | undefined;
}

const checkSub = (node: ITagNode, IDList: IIDCache, isDefs = false) => {
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
				rmNode(childNode);
			}
		}
		if (!node.childNodes.length) {
			rmNode(node);
		} else if (!isDefs) {
			(node.parentNode as INode).replaceChild(node, ...node.childNodes);
		}
	}
};

const checkDefsApply = (item: IIDCacheITem, dom: IDomNode) => {
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
			const originStyle: IAttrObj = {};
			const originAttr: IAttrObj = {};
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
			const useTag = item.tag as ITagNode;
			(node.parentNode as ITagNode).replaceChild(node, useTag);
			const styleArray: IAttr[] = useTag.hasAttribute('style') ? execStyle(useTag.getAttribute('style') as string) : [];
			for (const [key, val] of Object.entries(originAttr)) {
				if (!useTag.hasAttribute(key) && !styleArray.some(sItem => sItem.fullname === key)) {
					useTag.setAttribute(key, val);
				}
			}
			for (const [key, val] of Object.entries(originStyle)) {
				if (!useTag.hasAttribute(key) && !styleArray.some(sItem => sItem.fullname === key)) {
					styleArray.push({
						name: key,
						fullname: key,
						value: val,
					});
				}
			}
			if (styleArray.length) {
				useTag.setAttribute('style', stringifyStyle(styleArray));
			}
			return;
		}
		case 'mpath': {
			const pathTag = item.tag as ITagNode;
			const mpathParent = node.parentNode as ITagNode;
			if (!shapeElements.includes(pathTag.nodeName)) {
				rmNode(node);
				rmNode(pathTag);
				if (!checkAnimateMotion(mpathParent, dom)) {
					rmNode(mpathParent);
				}
				return;
			}
			// 只针对路径元素进行应用
			if (pathTag.nodeName === 'path') {
				const d = pathTag.getAttribute('d');
				if (d) {
					mpathParent.setAttribute('path', d);
					rmNode(node);
					rmNode(pathTag);
				}
			}
			return;
		}
		default:
			break;
	}
};

export const shortenDefs = async (rule: TFinalConfigItem, dom: IDomNode): Promise<null> => new Promise(resolve => {
	if (rule[0]) {
		let firstDefs: ITagNode | undefined;

		// 首先合并 defs 标签
		traversalNode<ITagNode>(propEq('nodeName', 'defs'), node => {
			if (firstDefs) {
				for (const childNode of node.childNodes) {
					// 合并时只把标签类元素挪过去
					if (isTag(childNode)) {
						firstDefs.appendChild(childNode);
					}
				}
				rmNode(node);
			} else {
				firstDefs = node;
				for (let ci = node.childNodes.length; ci--;) {
					const childNode = node.childNodes[ci];
					// 只保留标签类的子元素
					if (!isTag(childNode)) {
						rmNode(childNode);
					}
				}
			}
		}, dom);

		if (firstDefs) {
			// 取出所有被引用的 ID
			const IDList: IIDCache = {};
			traversalNode<ITagNode>(isTag, node => {
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
			}, dom);

			checkSub(firstDefs, IDList, true);
			execStyleTree(dom);

			(Object.values(IDList) as IIDCacheITem[]).forEach(item => {
				if (item.tag) {
					// 有可能引用对象存在于 defs 内部，并且已被移除
					for (let i = item.iri.length; i--;) {
						const [tag] = item.iri[i];
						// 判断是否已从文档中移除
						if (!getAncestor(tag, (node: INode) => node.nodeName === '#document')) {
							item.iri.splice(i, 1);
						}
					}
					if (!item.iri.length) {
						rmNode(item.tag);
					}

					if (item.iri.length === 1) {
						checkDefsApply(item, dom);
					}
				}
			});
		}
	}
	resolve();
});
