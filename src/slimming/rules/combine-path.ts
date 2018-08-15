// 合并属性和样式完全相同的路径
import { has } from 'ramda';
import { IAttr, INode } from '../../node/index';
import { execStyle } from '../style/exec';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

export const combinePath = (rule, dom: INode) => new Promise((resolve, reject) => {
	if (rule[0]) {
		traversalNode(isTag, (node: INode) => {
			const pathChildren = {};
			for (let i = 0; i < node.childNodes.length; i++) {
				const childNode = node.childNodes[i];
				if (childNode.nodeName === 'path') {
					const attrObj = {};
					let styles: IAttr[] = [];
					let d = null;
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
							// TODO，此处用了简单粗暴的处理逻辑，没有 fill 的路径才可以合并
							// 更妥善的做法是：1、没有fill或者2、路径没有相交或包含
							if (key.indexOf('&fill=none&') !== -1) {
								pathChildren[key].value += d.value;
								rmNode(childNode);
								i--;
							}
						} else {
							pathChildren[key] = d;
						}
					}
				}
			}
		}, dom);
	}
	resolve();
});