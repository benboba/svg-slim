import { IDynamicObj, IEnvOption, IFinalConfig, IParamsOption, TBaseObj, TRuleOption, TRuleOptionVal } from '../../../typings';
import { hasProp } from '../utils/has-prop';
import { isObj } from '../utils/is-obj';
import { envConfig, paramsConfig, rulesConfig } from './config';

const mergeUserVal = (v: TRuleOptionVal, _v: unknown): TRuleOptionVal => {
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

const checkRules = (userConfig: TBaseObj, finalRules: TRuleOption) => {
	for (const [key, val] of Object.entries(userConfig)) {
		// 只合并存在的值
		if (hasProp(finalRules, key)) {
			const conf = finalRules[key];
			// 布尔值直接设置开关位置
			if (typeof val === 'boolean') {
				conf[0] = val;
			} else if (Array.isArray(val) && typeof val[0] === 'boolean') {
				// 如果开关位置不是布尔值，后续直接抛弃处理
				conf[0] = val[0] as boolean;
				// 默认配置如果没有 option 则不必再验证，如果没有打开配置项，后续也不必再验证
				if (conf[0] && conf[1]) {
					const option = conf[1];
					// 仅验证拿到 IRulesConfigOption 的情况
					const userOption = val[1];
					if (isObj<IDynamicObj<TRuleOptionVal>>(userOption)) {
						for (const [k, v] of Object.entries(userOption)) {
							if (hasProp(option, k)) {
								option[k] = mergeUserVal(option[k], v);
							}
						}
					}
				}
			}
		}
	}
};

export const mergeConfig = (userConfig: unknown): IFinalConfig => {
	const finalConfig: {
		rules: TRuleOption;
		params: Partial<IParamsOption>;
		env: Partial<IEnvOption>;
	} = {
		rules: {},
		params: { ...paramsConfig },
		env: { ...envConfig },
	};
	// 首先把默认规则深拷贝合并过来
	for (const [key, [_switch, _option]] of Object.entries(rulesConfig)) {
		finalConfig.rules[key] = [_switch];
		if (_option) {
			const option: IDynamicObj<TRuleOptionVal> = {};
			for (const [k, v] of Object.entries(_option)) {
				option[k] = Array.isArray(v) ? v.slice() : v;
			}
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			finalConfig.rules[key]!.push(option);
		}
	}
	if (isObj<IDynamicObj<unknown>>(userConfig)) {
		const uConfig = userConfig;
		checkRules(uConfig, finalConfig.rules);
		if (hasProp(uConfig, 'rules') && isObj<TRuleOption>(uConfig.rules)) {
			checkRules(uConfig.rules, finalConfig.rules);
		}

		const uEnv = uConfig.env;
		if (hasProp(uConfig, 'env') && isObj<IEnvOption>(uEnv)) {
			(Object.keys(envConfig)).forEach(k => {
				if (hasProp(uEnv, k)) {
					const uk = uEnv[k];
					finalConfig.env[k] = mergeUserVal(uEnv[k], uk) as never;
				}
			});
		}

		const uParams = uConfig.params;
		if (hasProp(uConfig, 'params') && isObj<IParamsOption>(uParams)) {
			(Object.keys(paramsConfig)).forEach(k => {
				if (hasProp(uParams, k)) {
					const uk = uParams[k];
					finalConfig.params[k] = mergeUserVal(paramsConfig[k], uk) as never;
				}
			});
		}
	}
	return finalConfig as IFinalConfig;
};
