import { INode } from '../../node/index';
import { transformAttributes } from '../const/definitions';
import { combineMatrix } from '../matrix/combine';
import { shorten } from '../matrix/shorten';
import { isTag } from '../xml/is-tag';
import { traversalNode } from '../xml/traversal-node';

const DEFAULT_DIGIT1 = 3;
const DEFAULT_DIGIT2 = 1;

export const combineTransform = (rule, dom: INode) => {
	if (rule[0]) {
		let digit1: number = rule.length > 1 ? rule[1] : DEFAULT_DIGIT1;
		let digit2: number = rule.length > 2 ? rule[2] : DEFAULT_DIGIT2;
		traversalNode(isTag, (node: INode) => {
			const attributes = node.attributes;
			for (let i = attributes.length; i--; ) {
				const attr = attributes[i];
				if (transformAttributes.indexOf(attr.fullname) !== -1) {
					const transform = attr.value.trim();
					if (transform) {
						const matrix = shorten(combineMatrix(transform, digit1, digit2));
						if (matrix === 'matrix(1,0,0,1,0,0)') {
							node.removeAttribute(attr.fullname);
						} else if (matrix.length < transform.length) {
							attr.value = matrix;
						} else {
							attr.value = shorten(transform);
						}
					} else {
						node.removeAttribute(attr.fullname);
					}
				}
			}
		}, dom);
	}
};