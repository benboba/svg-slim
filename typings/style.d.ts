import { Rule } from 'css';
import { attrModifier, selectorUnitCombinator } from '../src/slimming/style/define';

// 属性选择器接口定义
export interface IAttrSelector {
	key: string;
	modifier?: attrModifier;
	value?: string;
}

// 伪类选择器接口定义
export interface IPseudo {
	func: string;
	isClass: boolean;
	value?: string;
}

// 选择器接口定义
export interface ISelector {
	universal?: boolean;
	type?: string;
	id: string[];
	class: string[];
	attr: IAttrSelector[];
	pseudo: IPseudo[];
	combinator?: selectorUnitCombinator;
}

// 选择器权重
export interface ISeletorPriority {
	id: number;
	class: number;
	tag: number;
}

// 在 shorten-class 和 shorten-id 中会用到，通过设置 ruleId 属性来排重
export interface IExtendRule extends Rule {
	ruleId?: number;
}

