import { propEq } from 'ramda';
import { INode, IAttr } from '../../node/index';
import { ConfigItem } from '../config/config';
import { regularAttr } from '../const/regular-attr';
import { funcIRIToID, IRIFullMatch } from '../const/syntax';
import { IUnique } from '../interface/unique';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';
import { ITagNode } from '../interface/node';

const checkSub = (node: ITagNode, IDList: IUnique) => {
	let hasId = false;
	for (let i = node.attributes.length; i--;) {
		const attr = node.attributes[i];
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
		for (let ci = node.childNodes.length; ci--;) {
			const childNode = node.childNodes[ci];
			if (isTag(childNode)) {
				checkSub(childNode as ITagNode, IDList);
			} else {
				rmNode(childNode);
			}
		}
		if (!node.childNodes.length) {
			rmNode(node);
		}
	}
};

export const shortenDefs = async (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		let firstDefs: ITagNode | undefined;
		const IDList: IUnique = {};

		// 首先取出所有被引用的 ID
		traversalNode<ITagNode>(isTag, node => {
			node.attributes.forEach(attr => {
				if (regularAttr[attr.fullname].maybeFuncIRI) {
					const firi = funcIRIToID.exec(attr.value);
					if (firi) {
						IDList[firi[2]] = true;
					}
				} else if (regularAttr[attr.fullname].maybeIRI) {
					const iri = IRIFullMatch.exec(attr.value);
					if (iri) {
						IDList[iri[1]] = true;
					}
				}
			});
		}, dom);

		// 合并 defs 标签
		traversalNode<ITagNode>(propEq('nodeName', 'defs'), node => {
			if (firstDefs) {
				node.childNodes.forEach(childNode => {
					(firstDefs as INode).appendChild(childNode);
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
