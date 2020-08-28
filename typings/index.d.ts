import { IDomNode, INode } from './node';

export interface IDynamicObj<T> {
	[attr: string]: T;
}

// k, v 都是字符串的动态类型
export type TAttrObj = IDynamicObj<string>;

// 通过关键字排重
export type TUnique = IDynamicObj<boolean>;

export type TBaseObj = Record<never, unknown>;

export type TRuleOptionVal = number | boolean | string[];

export type TRuleOption = IDynamicObj<[boolean, IDynamicObj<TRuleOptionVal>?]>;

export interface IFinalConfig {
	rules: TRuleOption;
	params: IParamsOption;
	env: IEnvOption;
}

export interface IParamsOption {
	angelDigit: number;
	sizeDigit: number;
	trifuncDigit: number;
	opacityDigit: number;
	thinning: number;
	straighten: number;
	mergePoint: number;
	rmAttrEqDefault: boolean;
	exchangeStyle: boolean;
}

export interface IEnvOption {
	ie: number;
}

export interface IRuleOption {
	option: IDynamicObj<TRuleOptionVal>;
	params: IParamsOption;
	env: IEnvOption;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TRuleFunction = (dom: IDomNode, rule: IRuleOption) => Promise<void>;

export type TRulesItem = [boolean, TRuleFunction, string?];

export interface IMatrixFunc {
	type: 'translate' | 'rotate' | 'scale' | 'skewX' | 'skewY' | 'matrix'; // 函数类型
	noEffect?: boolean; // 是否无效
	val: number[]; // 参数列表
}

export interface IRegularTag {
	isUndef?: boolean;
	containTextNode?: boolean;
	legalChildElements: { transparent?: boolean; noself?: boolean; any?: boolean; childElements?: string[] };
	ownAttributes: string[];
	onlyAttr?: string[];
}

export type TLegalValueItem = {
	type: 'attr';
	tag?: string[];
} | {
	type: 'string';
	value: string;
	tag?: string[];
} | {
	type: 'reg';
	value: RegExp;
	tag?: string[];
} | {
	type: 'enum';
	value: string;
	tag?: string[];
} | {
	type: 'func';
	value: IFnDef;
	tag?: string[];
}

export interface IRegularAttr {
	name: string;
	isUndef?: boolean;
	couldBeStyle?: boolean;
	cantTrans?: boolean; // 不支持 css 和属性互转
	cantBeAttr?: boolean; // 不能作为属性，只能放在 style 中
	inherited?: boolean;
	animatable?: boolean;
	maybeColor?: boolean;
	maybeIRI?: boolean;
	maybeFuncIRI?: boolean;
	maybeSizeNumber?: boolean;
	maybeAccurateNumber?: boolean;
	maybeAlpha?: boolean;
	legalValues: TLegalValueItem[];
	initValue: string | Array<{
		val: string;
		tag: string[];
	}>;
	applyTo: string[];
}

export interface IPathItem {
	type: string;
	val: number[];
}

export interface IPathResultItem extends IPathItem {
	from: number[];
}

export interface IRGBColor {
	r: number;
	g: number;
	b: number;
	a: number;
	origin: string;
	valid: boolean;
}

export interface IAnimateAttr {
	attributeName: string;
	node: INode,
	keys: string[],
	values: string[];
}

export type TFnValue = {
	type: 'number' | 'int';
	area?: [number, number];
} | {
	type: 'length';
	unit?: string;
	area?: [number, number];
} | {
	type: 'enum';
	enum: string;
}

export interface IFnDef {
	name: string;
	values: TFnValue[];
	valueLen?: [number, number]; // [a, b]，值的长度应符合 an+b 的规则，即 (value.length - b) % a = 0
	valueLenArea?: [number, number]; // 值的长度的最小值和最大值
	valueRepeat: [number, number]; // [a, b]，用于规定 values 规则的 an+b 重复逻辑
}
