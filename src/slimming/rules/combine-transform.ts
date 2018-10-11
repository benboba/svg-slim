import { INode } from '../../node/index';
import { transformAttributes } from '../const/definitions';
import { combineMatrix } from '../matrix/combine';
import { isTag } from '../xml/is-tag';
import { traversalNode } from '../xml/traversal-node';
import { ConfigItem } from '../config/config';
import { execMatrix, IMatrixFunc } from '../matrix/exec';
import { stringify } from '../matrix/stringify';
import { merge } from '../matrix/merge';

const DEFAULT_DIGIT1 = 3;
const DEFAULT_DIGIT2 = 1;
const DEFAULT_DIGIT3 = 2;

export const combineTransform = (rule: ConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		// digit1 = 矩阵前 4 位的精度，digit2 = 矩阵后 2 位的精度
		let digit1: number = rule.length > 1 ? rule[1] as number : DEFAULT_DIGIT1;
		let digit2: number = rule.length > 2 ? rule[2] as number : DEFAULT_DIGIT2;
		let digit3: number = rule.length > 3 ? rule[3] as number : DEFAULT_DIGIT3;
		traversalNode(isTag, (node: INode) => {
			const attributes = node.attributes;
			for (let i = attributes.length; i--; ) {
				const attr = attributes[i];
				if (transformAttributes.indexOf(attr.name) !== -1) {
					const transform: IMatrixFunc[] = [];
					execMatrix(attr.value.trim()).forEach(mFunc => {
						const lastFunc = transform[transform.length - 1];
						if (lastFunc && lastFunc.type === mFunc.type) {
							const mergeFunc = merge(lastFunc, mFunc, digit1, digit2, digit3);
							// 如果合并后为无效变化，则出栈，否则更新合并后的函数
							if (mergeFunc.noEffect) {
								transform.pop();
							} else {
								transform[transform.length - 1] = mergeFunc;
							}
						} else {
							transform.push(mFunc);
						}
					});
					if (transform.length) {
						const matrix = combineMatrix(transform, digit1, digit2, digit3);
						const transformStr = stringify(transform, digit1, digit2, digit3);
						const matrixStr = stringify([matrix], digit1, digit2, digit3);
						if (matrix.noEffect) {
							node.removeAttribute(attr.fullname);
						} else {
							attr.value = (matrixStr.length < transformStr.length) ? matrixStr : transformStr;
						}
					} else {
						node.removeAttribute(attr.fullname);
					}
				}
			}
		}, dom);
	}
	resolve();
});