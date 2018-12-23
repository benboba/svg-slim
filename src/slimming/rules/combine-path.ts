// 合并属性和样式完全相同的路径
import { has } from 'ramda';
import { IAttr, INode } from '../../node/index';
import { execStyle } from '../style/exec';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';
import { ConfigItem } from '../config/config';

interface IPathChildrenItem {
	attr: IAttr;
	index: number;
}

interface IPathChildren {
	[propName: string]: IPathChildrenItem;
}

export const combinePath = (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		traversalNode(isTag, (node: INode) => {
			const pathChildren: IPathChildren = {};
			let tagIndex = 0;
			for (let i = 0; i < node.childNodes.length; i++) {
				const childNode = node.childNodes[i];
				if (childNode.nodeName === 'path') {
					const attrObj = {};
					let styles: IAttr[] = [];
					let d: IAttr;
					childNode.attributes.forEach(attr => {
						if (attr.fullname === 'style') {
							styles = execStyle(attr.value);
						} else if (attr.fullname === 'd') {
							d = attr;
						} else {
							attrObj[attr.fullname] = attr.value;
						}
					});

					styles.forEach(attr => {
						attrObj[attr.name] = attr.value;
					});

					if (d) {
						const key = `&${Object.keys(attrObj).map(k => `${k}=${attrObj[k]}`).join('&')}&&style&&${styles.map(attr => `${attr.name}=${attr.value}`).join('&')}&`;
						if (has(key, pathChildren)) {
							// TODO，此处用了简单粗暴的处理逻辑，没有 fill，没有 class，没有 ID，并且相邻的 path 节点才可以合并
							// 更妥善的做法是：1、相邻；2、没有fill；3、路径没有相交或包含
							if (pathChildren[key].index === tagIndex - 1 && key.indexOf('&fill=none&') !== -1 && key.indexOf('&class=') === -1 && key.indexOf('&id=') === -1) {
								pathChildren[key].attr.value += d.value;
								rmNode(childNode);
								i--;
							} else {
								pathChildren[key] = {
									attr: d,
									index: tagIndex
								};
							}
						} else {
							pathChildren[key] = {
								attr: d,
								index: tagIndex
							};
						}
					}
				}
				if (isTag(childNode)) {
					tagIndex++;
				}
			}
		}, dom);
	}
	resolve();
});