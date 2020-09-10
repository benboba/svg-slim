import { IAttr } from 'svg-vdom';
import { IRegularAttr } from '../../typings';
import { regularAttr } from '../const/regular-attr';
import { useEnum } from './use-enum';
import { useFunc } from './use-func';
import { useReg } from './use-reg';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const properties = require('known-css-properties').all as string[];

export const legalValue = (attrDefine: IRegularAttr, attr: IAttr, nodeName = ''): boolean => {
	if (attrDefine.legalValues.length) {
		// 只要有一个规则命中就返回 true
		let noMatchRule = true; // 重要！要判断是否有可以用于验证的规则，如果所有规则不适用于验证当前属性，则不应该 return false，而应该 return true
		for (const legalRule of attrDefine.legalValues) {
			// 当前验证规则可能只适用于某些 tag，legalTag 表示当前规则适用于所有 tag 或当前验证的 tag 在规则匹配列表中
			const legalTag = !legalRule.tag || !nodeName || legalRule.tag.includes(nodeName);
			if (legalTag) {
				noMatchRule = false;
				switch (legalRule.type) {
					// 用正则判断
					case 'reg':
						if (useReg(legalRule.value, attr.value)) {
							return true;
						}
						break;
					// 用枚举判断
					case 'enum':
						if (useEnum(legalRule.value, attr.value)) {
							return true;
						}
						break;
					// 值应该是一个属性名，而且不允许循环引用
					case 'attr':
						if (!regularAttr[attr.value].isUndef && attr.fullname !== attr.value) {
							return true;
						}
						break;
					// 值应该是一个函数
					case 'func':
						if (useFunc(legalRule.value, attr.value)) {
							return true;
						}
						break;
					// 值应该是一个特定字符串
					default:
						if (legalRule.value === attr.value) {
							return true;
						}
						break;
				}
			}
		}
		return noMatchRule;
	}
	// 合法属性，或浏览器可识别的 css 属性
	return !attrDefine.isUndef || properties.includes(attrDefine.name);
};
