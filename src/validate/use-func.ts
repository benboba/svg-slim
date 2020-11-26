import { IFnDef, TArgDef } from '../../typings';
import { createFullMatch } from '../const/regs';
import { useEnum } from './use-enum';
import { useReg } from './use-reg';

const funcReg = createFullMatch('([^(]+)\\((.+)\\)');

const checkArg = (argDef: TArgDef, val: string) => {
	if (argDef.type === 'enum') {
		return useEnum(argDef.value, val);
	} else if (argDef.type === 'reg') {
		return useReg(argDef.value, val);
	} else {
		return argDef.value === val;
	}
};

export const useFunc = (fnDef: IFnDef, val: string): boolean => {
	const fn = funcReg.exec(val);
	// 不是函数
	if (!fn) return false;

	// 函数名对不上
	if (fn[1] !== fnDef.name) return false;

	const values = fn[2].split(',').map(s => s.trim());
	// 函数参数超出上限
	if (values.length > fnDef.args.length) {
		return false;
	}
	for (let i = 0; i < values.length; i++) {
		// 获取值的定义
		const argDef = fnDef.args[i];
		if (Array.isArray(argDef.def)) {
			if (!argDef.def.some(adef => checkArg(adef, values[i]))) {
				return false;
			}
		} else {
			if (!checkArg(argDef.def, values[i])) {
				return false;
			}
		}
	}
	if (values.length < fnDef.args.length) {
		const argDef = fnDef.args[values.length];
		return !!argDef.optional;
	}
	return true;
};
