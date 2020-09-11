import { Rule } from 'css';
import { IAttr } from 'svg-vdom';

// 选择器权重
export interface ISeletorPriority {
	id: number;
	class: number;
	tag: number;
}

export interface IStyleObj {
	[propName: string]: {
		value: string;
		from: 'attr' | 'styletag' | 'inline' | 'inherit';
		selectorPriority?: ISeletorPriority;
	};
}

// 在 shorten-class 和 shorten-id 中会用到，通过设置 ruleId 属性来排重
export interface IExtendRule extends Rule {
	ruleId?: number;
}

export interface IStyleAttr extends IAttr {
	important?: boolean;
}

