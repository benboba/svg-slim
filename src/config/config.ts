import { IParamsOption, TRuleOption } from '../../typings';
import { DEFAULT_ACCURATE_DIGIT, DEFAULT_MATRIX_DIGIT, DEFAULT_SIZE_DIGIT, OPACITY_DIGIT } from '../const';

export const paramsConfig: IParamsOption = {
	angelDigit: DEFAULT_ACCURATE_DIGIT, // 角度的数据精度
	sizeDigit: DEFAULT_SIZE_DIGIT, // 位移的数据精度
	trifuncDigit: DEFAULT_MATRIX_DIGIT, // 三角函数的数据精度
	opacityDigit: OPACITY_DIGIT, // alpha 值的精度
	thinning: 0, // 通过抽稀节点来优化路径，为 0 表示不进行抽稀
	straighten: 0, // 小尺寸的曲线转直线，为 0 表示不进行此项优化
	mergePoint: 0, // 合并路径中距离相近的点，为 0 表示不进行此项优化 TODO 尚未实现！
	rmAttrEqDefault: true, // 移除与默认值相同的样式
	exchangeStyle: false, // 无视 style 标签的存在，强制进行 style 和属性的互转 （[warning] svg 的样式覆盖规则是 style 属性 > style 标签 > 属性，所以这个规则可能导致不正确的覆盖！）
};

export const rulesConfig: TRuleOption = {
	// 合并 g 标签
	'collapse-g': [true],
	// 塌陷无意义的文本节点
	'collapse-textwrap': [true],
	// 合并 path 标签
	'combine-path': [true, {
		disregardFill: false, // 合并 fill 不为 none 的 path
		disregardOpacity: false, // 无视透明度进行合并
	}],
	// 分析并合并 transform 属性
	'combine-transform': [true],
	// 计算 path 的 d 属性，使之变得更短
	'compute-path': [true],
	// 移除非规范的属性
	'rm-attribute': [true, {
		keepAria: false, // 保留所有的 aria 属性和 role 属性 https://www.w3.org/TR/wai-aria-1.1
		keepEvent: false, // 保留所有的事件监听属性
	}],
	// 移除注释
	'rm-comments': [true],
	// 移除 DOCTYPE 声明
	'rm-doctype': [true],
	// 移除隐藏对象
	'rm-hidden': [true],
	// 移除不规范嵌套的标签
	'rm-irregular-nesting': [true, {
		ignore: [], // 配置忽略的标签列表
	}],
	// 移除非规范的标签
	// 配置不移除的非规范标签
	'rm-irregular-tag': [true, {
		ignore: [],
	}],
	// 移除 px 单位
	'rm-px': [true],
	// 移除不必要的标签
	// 配置需要移除的标签列表
	'rm-unnecessary': [true, {
		tags: ['desc', 'discard', 'foreignObject', 'video', 'audio', 'iframe', 'canvas', 'metadata', 'script', 'title', 'unknown', 'image'],
	}],
	// 移除 svg 标签的 version 属性
	'rm-version': [true],
	// 是否强制移除 viewBox 属性
	'rm-viewbox': [true],
	// 移除 xml 声明
	'rm-xml-decl': [true],
	// 如有必要，移除 xml 命名空间
	'rm-xmlns': [true],
	// 缩短动画元素
	'shorten-animate': [true, {
		remove: false, // 直接移除所有的动画元素
	}],
	// 缩短 className ，并移除不被引用的 className
	'shorten-class': [true],
	// 缩短颜色
	'shorten-color': [true, {
		rrggbbaa: false, // 是否缩短 rgba 格式的颜色到 16 进制
	}],
	// 缩短小数点后位数
	'shorten-decimal-digits': [true],
	// 合并所有的 defs ，移除无效的 defs 定义
	'shorten-defs': [true],
	// 移除无效的滤镜元素，移除不必要的滤镜元素属性
	'shorten-filter': [true],
	// 缩短 ID ，并移除不被引用的 ID
	'shorten-id': [true],
	// 缩短 shape 类型的节点
	'shorten-shape': [true],
	// 缩短 style 属性
	'shorten-style-attr': [true],
	// 缩短 style 标签的内容（合并相同规则、移除无效样式）
	// 深度分析，移除无效选择器、合并相同的选择器、合并相同规则
	'shorten-style-tag': [true, {
		deepShorten: true,
	}],
};
