import { IMix } from '../../typings';
import { createFullMatch, createUnitMatch } from '../const/regs';

// mix 主要应对以下这种取值规则，TODO：暂未支持 mix 嵌套
// https://www.w3.org/TR/css-values-4/#component-combinators
export const useMix = (rule: IMix, val: string) => {
	if (rule.type === '&') {
		const vals = val.split(/\s+/);
		for (let i = 0; i < vals.length; i++) {
			const v = rule.unit[i];
			if (!createFullMatch(v).test(vals[i])) {
				return false;
			}
		}
		return true;
	} else {
		let _val = val;
		for (let i = rule.unit.length; i--;) {
			const reg = createUnitMatch(rule.unit[i]);
			_val = _val.replace(reg, ' ');
		}
		return !_val.trim();
	}
};
