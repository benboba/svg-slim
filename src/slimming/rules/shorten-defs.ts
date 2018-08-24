import { propEq } from 'ramda';
import { INode } from '../../node/index';
import { ConfigItem } from '../config/config';
import { regularAttr } from '../const/regular-attr';
import { IUnique } from '../interface/unique';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

const funciriReg = /^url\((["']?)#(.+)\1\)$/;
const iriReg = /^#(.+)$/;

const checkSub = (node: INode, IDList: IUnique) => {
	let hasId = false;
	const attributes = node.attributes;
	for (let i = attributes.length; i--; ) {
		const attr = attributes[i];
		if (attr.fullname === 'id') {
			if (IDList[attr.value]) {
				hasId = true;
			} else {
				node.removeAttribute(attr.fullname);
			}
			break;
		}
	}
	if (!hasId) {
		const childNodes = node.childNodes;
		for (let ci = childNodes.length; ci--; ) {
			const childNode = childNodes[ci];
			if (isTag(childNode)) {
				checkSub(childNode, IDList);
			} else {
				rmNode(childNode);
			}
		}
		if (!node.childNodes.length) {
			rmNode(node);
		}
	}
};

export const shortenDefs = (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		let firstDefs: INode;
		const IDList: IUnique = {};

		// 首先取出所有被引用的 ID
		traversalNode(isTag, (node: INode) => {
			node.attributes.forEach(attr => {
				if (regularAttr[attr.fullname].maybeFuncIRI) {
					const firi = funciriReg.exec(attr.value);
					if (firi) {
						IDList[firi[2]] = true;
					}
				} else if (regularAttr[attr.fullname].maybeIRI) {
					const iri = iriReg.exec(attr.value);
					if (iri) {
						IDList[iri[1]] = true;
					}
				}
			});
		}, dom);

		// 合并 defs 标签
		traversalNode(propEq('nodeName', 'defs'), (node: INode) => {
			if (firstDefs) {
				node.childNodes.forEach(childNode => {
					firstDefs.appendChild(childNode);
				});
				rmNode(node);
			} else {
				firstDefs = node;
			}
		}, dom);

		if (firstDefs) {
			checkSub(firstDefs, IDList);
		}
	}
	resolve();
});