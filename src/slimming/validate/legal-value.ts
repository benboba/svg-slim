import { regularAttr } from '../const/regular-attr';
import { useEnum } from './use-enum';
import { useReg } from './use-reg';
import { CSSWideKeywords } from '../const/enum';

export const legalValue = (attrDefine: IRegularAttr, attr: IAttr, nodeName = ''): boolean => {
	if (attrDefine.legalValues.length) {
		// 只要有一个规则命中就返回 true
		for (const legalRule of attrDefine.legalValues) {
			// 当前验证规则可能只适用于某些 tag，legalTag 表示当前规则适用于所有 tag 或当前验证的 tag 在规则匹配列表中
			const legalTag = !legalRule.tag || !nodeName || legalRule.tag.indexOf(nodeName) !== -1;
			if (legalTag) {
				switch (legalRule.type) {
					// 用正则判断
					case 'reg':
						if (legalRule.reg && useReg(legalRule.reg, attr.value)) {
							return true;
						}
						break;
					// 用枚举判断
					case 'enum':
						if (legalRule.enum && useEnum(legalRule.enum, attr.value)) {
							return true;
						}
						break;
					// 值应该是一个属性名，而且不允许循环引用
					case 'attr':
						if (!regularAttr[attr.value].isUndef && attr.fullname !== attr.value) {
							return true;
						}
						break;
					// 值应该是一个特定字符串
					case 'string':
					default:
						if (legalRule.string === attr.value) {
							return true;
						}
						break;
				}
			}
		}
		// 可以转为 css 的属性，还需要验证是否匹配 css 值的全局关键字
		if (attrDefine.couldBeStyle) {
			if (useEnum(CSSWideKeywords, attr.value)) {
				return true;
			}
		}
		return false;
	} else {
		return true;
	}
};
