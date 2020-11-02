# 优化配置

优化配置是一个 JSON 格式的对象，目前支持 rules、params、browsers 三个属性，

下面是一个使用优化配置的示例：

```ts
const svgSlim = require('svg-slim');
const userConfig = {
	"rules": {
		"collapse-g": false,
		"combine-transform": false,
		"rm-attribute": [true, {
			"keepAria": true,
			"keepEvent": false
		}]
	},
	"params": {
		"trifuncDigit": 3,
		"sizeDigit": 2,
		"angelDigit": 2
	},
	"browsers": ["> 1%", "not ie 11", "not firefox < 99"]
};
svgSlim(svgcode, userConfig);
```

## Params

params 目前支持以下配置项

属性 | 类型 | 默认值 | 备注
---- | ---- | ---- | ----
sizeDigit | number | 2 | 位移类数据的精度
angelDigit | number | 2 | 角度类数据的精度
trifuncDigit | number | 3 | 三角函数类数据的精度
opacityDigit | number | 3 | 不透明度类的数据精度
thinning | number | 0 | 通过抽稀节点来优化路径，为 0 表示不进行抽稀，大于 0 表示抽稀节点的阈值
straighten | number | 0 | 把小尺寸的曲线转为直线，为 0 表示不进行此项优化，大于 0 表示曲线转直线的阈值
mergePoint | number | 0 | Merging straight nodes with similar distances in the path, 0 means that this optimization is not performed, and greater than 0 means the threshold of merged nodes
rmAttrEqDefault | boolean | true | 是否移除与默认值相同的样式
exchangeStyle | boolean | false | 是否无视 style 标签的存在，强制进行 style 和属性的互转 （**注意！** svg 的样式覆盖规则是 style 属性 > style 标签 > 属性，所以开启这个配置项可能导致不正确的覆盖！）
ignoreKnownCSS | boolean | false | 是否保留不能作为[属性](https://www.w3.org/TR/SVG/propidx.html)的 CSS 样式（**注意！**，很多 CSS3 的属性不在这个列表中，但在部分现代浏览器中仍然对 SVG 元素有效）

## Browsers

browsers 配置依赖 [browserslist](https://github.com/browserslist/browserslist#readme)，你可以在此处传入字符串/字符串列表，或者在 package.json 中配置 “browserslist” 属性

## Rules

下面是完整的优化规则列表，部分优化规则包含了额外的配置项。

所有规则默认都是打开状态，你可以通过优化配置的 rules 来关闭它们。

名称 | 配置项 | 备注
---- | ---- | ----
[apply-style](rules/apply-style.md) | 无 | 将 style 应用到目标元素
[collapse-g](rules/collapse-g.md) | 无 | 塌陷不必要的 g 元素
[collapse-textwrap](rules/collapse-textwrap.md) | 无 | 塌陷不必要的文本节点
[combine-path](rules/combine-path.md) | { disregardFill: boolean, disregardOpacity: boolean } | 合并相邻的路径元素
[combine-transform](rules/combine-transform.md) | 无 | 合并 transform 函数
[compute-path](rules/compute-path.md) | 无 | 计算并优化路径
[rm-attribute](rules/rm-attribute.md) | { keepAria: boolean, keepEvent: boolean } | 移除不必要的属性
[rm-comments](rules/rm-comments.md) | 无 | 移除注释
[rm-doctype](rules/rm-doctype.md) | 无 | 移除 DocType
[rm-hidden](rules/rm-hidden.md) | 无 | 移除不可见的内容
[rm-important](rules/rm-important.md) | 无 | 移除样式表中不必要的 !important
[rm-illegal-style](rules/rm-illegal-style.md) | 无 | 移除不规范的 style 属性
[rm-irregular-nesting](rules/rm-irregular-nesting.md) | { ignore: string\[] } | 移除不规则的嵌套
[rm-irregular-tag](rules/rm-irregular-tag.md) | { ignore: string\[] } | 移除不规范的标签
[rm-px](rules/rm-px.md) | 无 | 移除 px 单位
[rm-unnecessary](rules/rm-unnecessary.md) | { tags: string\[] } | 移除不必要的 svg 元素
[rm-version](rules/rm-version.md) | 无 | 移除 svg 的 version 属性
[rm-viewbox](rules/rm-viewbox.md) | 无 | 优化或移除 svg 的 viewbox 属性
[rm-xml-decl](rules/rm-xml-decl.md) | 无 | 移除 xml 声明节点
[rm-xmlns](rules/rm-xmlns.md) | 无 | 优化并移除不必要的 xml 命名空间
[shorten-animate](rules/shorten-animate.md) | { remove: boolean } | 优化动画元素
[shorten-class](rules/shorten-class.md) | 无 | 优化 className
[shorten-color](rules/shorten-color.md) | { rrggbbaa: boolean } | 优化颜色
[shorten-decimal-digits](rules/shorten-decimal-digits.md) | 无 | 优化数值类属性
[shorten-defs](rules/shorten-defs.md) | 无 | 优化 defs 节点下的内容
[shorten-filter](rules/shorten-filter.md) | 无 | 优化滤镜元素
[shorten-id](rules/shorten-id.md) | 无 | 优化 ID
[shorten-shape](rules/shorten-shape.md) | 无 | 优化图形类元素
[shorten-style-attr](rules/shorten-style-attr.md) | 无 | 优化 style 属性
[shorten-style-tag](rules/shorten-style-tag.md) | 无 | 优化 style 标签
[style-to-class](rules/style-to-class.md) | 无 | 为重复的 style 属性创建 className
