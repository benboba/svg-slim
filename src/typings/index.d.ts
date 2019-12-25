// k, v 都是字符串的动态类型
declare interface IAttrObj {
	[attr: string]: string;
}

// 通过关键字排重
declare interface IUnique {
	[propName: string]: boolean;
}

// k 是字符串 v 可能是任意类型的对象
declare interface IUnknownObj {
	[attr: string]: unknown;
}

declare type TConfigItem = boolean | number | string[];

declare interface IConfigOption {
	[propName: string]: TConfigItem;
}

declare type TFinalConfigItem = [boolean, IConfigOption?];

declare interface IConfig {
	[propName: string]: boolean | TConfigItem[] | TFinalConfigItem;
}

declare interface IFinalConfig {
	[propName: string]: TFinalConfigItem;
}

declare interface IMatrixFunc {
	type: string; // 函数类型
	noEffect?: boolean; // 是否无效
	val: number[]; // 参数列表
}

declare interface IRegularTag {
	isUndef?: boolean;
	containTextNode: boolean;
	legalChildElements: { transparent?: boolean; noself?: boolean; any?: boolean; childElements?: string[] };
	ownAttributes: string[];
}

declare interface ILegalValueItem {
	type: 'enum' | 'reg' | 'attr' | 'string';
	reg?: RegExp;
	enum?: {};
	tag?: string[];
	string?: string;
}

declare interface IRegularAttr {
	name: string;
	isUndef?: boolean;
	couldBeStyle: boolean;
	animatable: boolean;
	maybeColor: boolean;
	maybeIRI: boolean;
	maybeFuncIRI: boolean;
	maybeSizeNumber: boolean;
	maybeAccurateNumber: boolean;
	legalValues: ILegalValueItem[];
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
