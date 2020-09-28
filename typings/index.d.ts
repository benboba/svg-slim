import { IDocument, ITagNode } from 'svg-vdom';

export type TDynamicObj<T> = Record<string, T>;

// k, v 都是字符串的动态类型
export type TAttrObj = TDynamicObj<string>;

// 通过关键字排重
export type TUnique = TDynamicObj<boolean>;

export type TBaseObj = Record<never, unknown>;

export type TRuleOptionVal = number | boolean | string[];

export type TRuleOption = TDynamicObj<[boolean, TDynamicObj<TRuleOptionVal>?]>;

export interface IFinalConfig {
	rules: TRuleOption;
	params: IParamsOption;
	browsers: TDynamicObj<number>;
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

export interface IRuleOption {
	option: TDynamicObj<TRuleOptionVal>;
	params: IParamsOption;
	browsers: IFinalConfig['browsers'];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TRuleFunction = (dom: IDocument, rule: IRuleOption) => Promise<void>;

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

export type TArgDef = {
	type: 'enum';
	value: string;
} | {
	type: 'reg';
	value: RegExp;
} | {
	type: 'string';
	value: string;
}

export interface IFnDef {
	name: string;
	args: Array<{
		optional?: boolean;
		def: TArgDef | TArgDef[];
	}>;
}

export interface IMix {
	type: '|' | '&',
	unit: string[],
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
	type: 'mix';
	value: IMix;
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
	node: ITagNode,
	keys: string[],
	values: string[];
}
