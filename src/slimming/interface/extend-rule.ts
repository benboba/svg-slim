import { Rule } from 'css';

// 在 shorten-class 和 shorten-id 中会用到，通过设置 ruleId 属性来排重
export interface IExtendRule extends Rule {
	ruleId?: number;
}
