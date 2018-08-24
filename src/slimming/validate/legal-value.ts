import { IRegularAttr, regularAttr } from '../const/regular-attr';
import { useEnum } from './use-enum';
import { useReg } from './use-reg';
import { IAttr } from '../../node';

// TODO
export const legalValue = (attrDefine: IRegularAttr, attr: IAttr): boolean => {
	if (attrDefine.legalValues.length) {
		let legal = true;
		for (const legalRule of attrDefine.legalValues) {
			switch (legalRule.type) {
				// 用正则判断
				case 'reg':
					if (!useReg(legalRule.reg, attr.value)) {
						return false;
					}
					break;
				// 用枚举判断
				case 'enum':
					if (!useEnum(legalRule.enum, attr.value)) {
						return false;
					}
					break;
				// 值应该是一个属性名，而且不允许循环引用
				case 'attr':
					return !regularAttr[attr.value].isUndef && attr.fullname !== attr.value;
				default:
					break;
			}
		}
		return legal;
	} else {
		return true;
	}
};