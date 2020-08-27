declare interface IDynamicObj<T> {
	[attr: string]: T;
}

// k, v 都是字符串的动态类型
declare type TAttrObj = IDynamicObj<string>;

// 通过关键字排重
declare type TUnique = IDynamicObj<boolean>;

declare type TBaseObj = Record<never, unknown>;

declare type TRuleOptionVal = number | boolean | string[];

declare type TRuleOption = IDynamicObj<[boolean, IDynamicObj<TRuleOptionVal>?]>;

declare interface IFinalConfig {
	rules: TRuleOption;
	params: IParamsOption;
	env: IEnvOption;
}

declare interface IParamsOption {
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

declare interface IEnvOption {
	ie: number;
}

declare interface IRuleOption<T extends IDynamicObj<TRuleOptionVal>> {
	option: T;
	params: IParamsOption;
	env: IEnvOption;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type TRuleFunction = (dom: IDomNode, rule: IRuleOption<any>) => Promise<void>;

declare type TRulesItem = [boolean, TRuleFunction, string?];

declare interface IMatrixFunc {
	type: 'translate' | 'rotate' | 'scale' | 'skewX' | 'skewY' | 'matrix'; // 函数类型
	noEffect?: boolean; // 是否无效
	val: number[]; // 参数列表
}

declare interface IRegularTag {
	isUndef?: boolean;
	containTextNode?: boolean;
	legalChildElements: { transparent?: boolean; noself?: boolean; any?: boolean; childElements?: string[] };
	ownAttributes: string[];
	onlyAttr?: string[];
}

declare type TLegalValueItem = {
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

declare interface IRegularAttr {
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

declare interface IPathItem {
	type: string;
	val: number[];
}

declare interface IPathResultItem extends IPathItem {
	from: number[];
}

declare interface IRGBColor {
	r: number;
	g: number;
	b: number;
	a: number;
	origin: string;
	valid: boolean;
}

declare interface IAnimateAttr {
	attributeName: string;
	node: INode,
	keys: string[],
	values: string[];
}

declare module 'svg-path-contours' {
	function contours(arr: [string, ...number[]][]): Array<[number, number][]>;
	export = contours;
}

declare module 'triangulate-contours' {
	function triangulate(arr: Array<[number, number][]>): {
		positions: [number, number][];
		cells: [number, number, number][];
	};
	export = triangulate;
}

declare type TFnValue = {
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

declare interface IFnDef {
	name: string;
	values: TFnValue[];
	valueLen?: [number, number]; // [a, b]，值的长度应符合 an+b 的规则，即 (value.length - b) % a = 0
	valueLenArea?: [number, number]; // 值的长度的最小值和最大值
	valueRepeat: [number, number]; // [a, b]，用于规定 values 规则的 an+b 重复逻辑
}
