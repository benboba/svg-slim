import { IRuleOption, IFinalConfig, TDynamicObj, TRuleOptionVal } from '../../typings';

export const createRuleConfig = (finalConfig: IFinalConfig, key?: string): IRuleOption => {
	const config: IRuleOption = {
		params: { ...finalConfig.params },
		browsers: { ...finalConfig.browsers },
		option: {},
	};
	if (key) {
		config.option = finalConfig.rules[key][1] as TDynamicObj<TRuleOptionVal>;
	}
	return config;
};
