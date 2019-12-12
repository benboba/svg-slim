// 选择器混合字符，不含后代选择器（空格）
export enum selectorUnitCombinator {
	'>' = 1,
	'+',
	'~',
}

// 属性选择器等号修饰符
export enum attrModifier {
	'^' = 1,
	'$',
	'~',
	'|',
	'*',
}
