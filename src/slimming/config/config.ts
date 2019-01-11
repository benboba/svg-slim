const DEFAULT_SIZE_DIGIT = 1;
const DEFAULT_ACCURATE_DIGIT = 2;
const DEFAULT_MATRIX_DIGIT = 3;

export type ConfigItem = (boolean | string | string[] | number)[];

export interface IConfig {
	[propName: string]: boolean | ConfigItem;
}

export const config: IConfig = {
	// 合并 g 标签
	'collapse-g': true,
	// 塌陷无意义的文本节点
	'collapse-textwrap': true,
	// 合并 path 标签
	// 合并 fill 不为 none 的 path
	// 无视透明度进行合并
	'combine-path': [true, false, false],
	// 分析并合并 transform 属性
	// 合并后的 matrix 的 a, b, c, d 四个位置的数据精度
	// 合并后的 e, f 位置的数据精度
	// 对角度类数据保留多少位精度
	'combine-transform': [true, DEFAULT_MATRIX_DIGIT, DEFAULT_SIZE_DIGIT, DEFAULT_ACCURATE_DIGIT],
	// 计算 path 的 d 属性，使之变得更短
	// 应用道格拉斯-普克算法抽稀路径节点
	// 抽稀节点的阈值
	// 尺寸相关数据的精度
	// 角度相关数据的精度
	'compute-path': [true, false, 0, DEFAULT_SIZE_DIGIT, DEFAULT_ACCURATE_DIGIT],
	// 对 polygon 和 polyline 应用道格拉斯-普克算法抽稀路径节点
	// 抽稀节点的阈值
	'douglas-peucker': [false, 0],
	// 移除非规范的属性
	// 移除与默认值相同的属性
	// 保留所有的事件监听属性
	// 保留所有的 aria 属性和 role 属性 https://www.w3.org/TR/wai-aria-1.1
	'rm-attribute': [true, true, false, false],
	// 移除注释
	'rm-comments': true,
	// 移除 DOCTYPE 声明
	'rm-doctype': true,
	// 移除隐藏对象
	'rm-hidden': true,
	// 移除不规范嵌套的标签
	// 配置忽略的标签列表
	'rm-irregular-nesting': [true, []],
	// 移除非规范的标签
	// 配置不移除的非规范标签
	'rm-irregular-tag': [true, []],
	// 移除 px 单位
	'rm-px': true,
	// 移除不必要的标签
	// 配置需要移除的标签列表
	'rm-unnecessary': [true, ['desc', 'discard', 'foreignObject', 'video', 'audio', 'iframe', 'canvas', 'metadata', 'script', 'title', 'unknown']],
	// 移除 svg 标签的 version 属性
	'rm-version': true,
	// 是否强制移除 viewBox 属性
	'rm-viewbox': true,
	// 移除 xml 声明
	'rm-xml-decl': true,
	// 如有必要，移除 xml 命名空间
	'rm-xmlns': true,
	// 形状和 path 互转，取最小组合
	'shape-to-path': true,
	// 缩短 className ，并移除不被引用的 className
	'shorten-class': true,
	// 缩短颜色
	// 是否缩短 rgba 格式的颜色到 16 进制
	// alpha 值的精度
	'shorten-color': [true, false, DEFAULT_ACCURATE_DIGIT],
	// 缩短小数点后位数
	// 尺寸相关属性的位数
	// 其它类型属性的位数
	'shorten-decimal-digits': [true, DEFAULT_SIZE_DIGIT, DEFAULT_ACCURATE_DIGIT],
	// 合并所有的 defs ，移除无效的 defs 定义
	'shorten-defs': true,
	// 缩短 ID ，并移除不被引用的 ID
	'shorten-id': true,
	// 缩短 style 属性
	// 根据情况进行 style 和属性的互转 （[warning] svg 的样式覆盖规则是 style 属性 > style 标签 > 属性，所以这个规则可能导致不正确的覆盖！）
	'shorten-style-attr': [true, false],
	// 缩短 style 标签的内容（合并相同规则、移除无效样式）
	// 深度分析，移除无效选择器、合并相同的选择器、合并相同规则
	'shorten-style-tag': [true, true],
};
