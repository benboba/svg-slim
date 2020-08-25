import { hasProp } from '../utils/has-prop';
import { rulesConfig, paramsConfig, envConfig } from './config';
import { or, equals } from 'ramda';
import { isObj } from '../utils/is-obj';

const mergeUserVal = (v: TRulesConfigVal, _v: unknown): TRulesConfigVal => {
	if (Array.isArray(v)) {
		// 数组只要字符串项
		if (Array.isArray(_v)) {
			return _v.filter(s => typeof s === 'string');
		}
	} else if (typeof v === typeof _v) {
		if (typeof _v === 'number') {
			// 数值项要忽略 NaN、Infinity 和负数，并下取整
			// 数值精度最多保留 8 位
			if (_v >= 0 && _v !== Infinity) {
				return Math.floor(_v);
			}
		} else {
			return _v as boolean;
		}
	}
	return v;
};

const checkRules = (userConfig: TBaseObj, finalConfig: IConfig['rules']) => {
	for (const [key, val] of Object.entries(userConfig)) {
		// 只合并存在的值
		if (hasProp(finalConfig, key)) {
			const conf = finalConfig[key];
			// 布尔值直接设置开关位置
			if (typeof val === 'boolean') {
				conf[0] = val;
			} else if (Array.isArray(val) && typeof val[0] === 'boolean') {
				// 如果开关位置不是布尔值，后续直接抛弃处理
				conf[0] = val[0];
				// 默认配置如果没有 option 则不必再验证，如果没有打开配置项，后续也不必再验证
				if (conf[0] && conf[1]) {
					// 仅验证拿到 IRulesConfigOption 的情况
					if (typeof val[1] === 'object' && val[1] && !Array.isArray(val[1])) {
						for (const [k, v] of Object.entries(val[1])) {
							if (hasProp(conf[1], k)) {
								conf[1][k] = mergeUserVal(conf[1][k], v);
							}
						}
					}
				}
			}
		}
	}
};

export const mergeConfig = (userConfig: unknown) => {
	const finalConfig: IConfig = {
		rules: {},
		env: {},
		params: {},
	};
	// 首先把默认规则深拷贝合并过来
	for (const [key, val] of Object.entries(rulesConfig)) {
		finalConfig.rules[key] = [val[0]];
		if (val[1]) {
			const option: IRulesConfigOption = {};
			for (const [k, v] of Object.entries(val[1])) {
				option[k] = Array.isArray(v) ? v.slice() : v;
			}
			finalConfig.rules[key][1] = option;
		}
	}
	if (isObj(userConfig)) {
		const uConfig = userConfig as TBaseObj;
		checkRules(uConfig, finalConfig.rules);
		if (hasProp(uConfig, 'rules') && isObj(uConfig.rules)) {
			checkRules(uConfig.rules, finalConfig.rules);
		}

		const uEnv = uConfig.env;
		if (hasProp(uConfig, 'env') && isObj(uEnv)) {
			Object.keys(envConfig).forEach(k => {
				if (hasProp(uEnv, k)) {
					const eq = equals(typeof uEnv[k]);
					finalConfig.env[k] = or(eq('string'), eq('number')) ? uEnv[k] as string | number : envConfig[k];
				}
			});
		}

		const uParams = uConfig.params;
		if (hasProp(uConfig, 'params') && isObj(uParams)) {
			Object.keys(paramsConfig).forEach(k => {
				if (hasProp(uParams, k)) {
					const eq = equals(typeof uParams[k]);
					finalConfig.params[k] = or(eq('string'), eq('number')) ? uParams[k] as number | boolean : paramsConfig[k];
				}
			});
		}
	}
	return finalConfig;
};
