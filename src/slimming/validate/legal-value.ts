import { IRegularAttr } from '../const/regular-attr';
import { useEnum } from './use-enum';
import { useReg } from './use-reg';

// TODO
export const legalValue = (attrDefine: IRegularAttr, val: string): boolean => {
	if (attrDefine.legalValues.length) {
		let legal = true;
		for (const legalRule of attrDefine.legalValues) {
			switch (legalRule.type) {
				case 'reg':
					if (!useReg(legalRule.reg, val)) {
						return false;
					}
					break;
				case 'enum':
					if (!useEnum(legalRule.enum, val)) {
						return false;
					}
					break;
				default:
					break;
			}
		}
		return legal;
	} else {
		return true;
	}
};