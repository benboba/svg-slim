import { IRuleOption, IFinalConfig, IDynamicObj, TRuleOptionVal } from 'typings';

export const createRuleConfig = (finalConfig: IFinalConfig, key?: string): IRuleOption => {
	const config: IRuleOption = {
		params: finalConfig.params,
		env: finalConfig.env,
		option: {},
	};
	if (key) {
		config.option = finalConfig.rules[key][1] as IDynamicObj<TRuleOptionVal>;
	}
	return config;
};
