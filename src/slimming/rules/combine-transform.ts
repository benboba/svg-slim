import { transformAttributes } from '../const/definitions';
import { combineMatrix } from '../matrix/combine';
import { isTag } from '../xml/is-tag';
import { traversalNode } from '../xml/traversal-node';
import { execMatrix } from '../matrix/exec';
import { stringify } from '../matrix/stringify';
import { merge } from '../matrix/merge';

export const combineTransform = async (rule: TFinalConfigItem, dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0]) {
		// digit1 = 矩阵前 4 位的精度，digit2 = 矩阵后 2 位的精度
		const {
			trigDigit,
			sizeDigit,
			angelDigit,
		} = rule[1] as {
			trigDigit: number;
			sizeDigit: number;
			angelDigit: number;
		};
		traversalNode<ITagNode>(isTag, node => {
			const attributes = node.attributes;
			for (let i = attributes.length; i--;) {
				const attr = attributes[i];
				if (transformAttributes.includes(attr.name)) {
					const transform: IMatrixFunc[] = [];
					execMatrix(attr.value.trim()).forEach(mFunc => {
						const lastFunc = transform[transform.length - 1];
						if (transform.length && lastFunc.type === mFunc.type) {
							const mergeFunc = merge(lastFunc, mFunc, trigDigit, sizeDigit, angelDigit);
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
						const matrix = combineMatrix(transform, trigDigit, sizeDigit, angelDigit);
						const transformStr = stringify(transform, trigDigit, sizeDigit, angelDigit);
						const matrixStr = stringify([matrix], trigDigit, sizeDigit, angelDigit);
						// TODO：把 transform 应用到元素
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
