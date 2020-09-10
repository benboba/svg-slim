import { trim } from 'ramda';
import { IFnDef } from '../../typings';
import { useEnum } from './use-enum';

const funcReg = new RegExp('^([^(]+)\\((.+)\\)$');

export const useFunc = (fnDef: IFnDef, val: string): boolean => {
	const fn = funcReg.exec(val);
	if (fn) {
		if (fn[1] !== fnDef.name) {
			return false;
		}
		const values = fn[2].split(',').map(trim);
		// 值的长度必须符合 an+b
		if (fnDef.valueLen && (values.length - fnDef.valueLen[1]) % fnDef.valueLen[0]) {
			return false;
		}
		// 值的长度必须位于合法区间
		if (fnDef.valueLenArea && (values.length < fnDef.valueLenArea[0] || values.length > fnDef.valueLenArea[1])) {
			return false;
		}
		for (let i = 0; i < values.length; i++) {
			// 获取值的定义
			const valueDef = fnDef.values[(i - fnDef.valueRepeat[1]) % fnDef.valueRepeat[0]];
			if (valueDef.type === 'number' || valueDef.type === 'int') {
				// 数值必须可以正确执行类型转换
				const val = +values[i];
				if (Number.isNaN(val)) {
					return false;
				}
				if (valueDef.area) {
					// 数值必须在正确的范围
					if (val < valueDef.area[0] || val > valueDef.area[1]) {
						return false;
					}
				}
				if (valueDef.type === 'int') {
					if (val !== Math.floor(val)) {
						return false;
					}
				}
			} else if (valueDef.type === 'enum') {
				if (!useEnum(valueDef.enum, values[i])) {
					return false;
				}
			}
		}
		return true;
	} 
	return false;
};
