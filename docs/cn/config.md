# 优化配置

优化配置是一个 JSON 格式的对象，目前支持 rules、params、browsers 三个属性，

下面是一个使用优化配置的示例：

```ts
const svgSlimming = require('svg-slimming');
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
svgSlimming(svgcode, userConfig);
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

## Browsers

browsers 配置依赖 [browserslist](https://github.com/browserslist/browserslist#readme)，你可以在此处传入字符串/字符串列表，或者在 package.json 中配置 “browserslist” 属性

## Rules

下面是完整的优化规则列表，部分优化规则包含了额外的配置项。

所有规则默认都是打开状态，你可以通过优化配置的 rules 来关闭它们。

名称 | 配置项 | 备注
---- | ---- | ----
[collapse-g](#collapse-g) | 无 | 塌陷不必要的 g 元素
[collapse-textwrap](#collapse-textwrap) | 无 | 塌陷不必要的文本节点
[combine-path](#combine-path) | { disregardFill: boolean, disregardOpacity: boolean } | 合并相邻的路径元素
[combine-transform](#combine-transform) | 无 | 合并 transform 函数
[compute-path](#compute-path) | 无 | 计算并优化路径
[rm-attribute](#rm-attribute) | { keepAria: boolean, keepEvent: boolean } | 移除不必要的属性
[rm-comments](#rm-comments) | 无 | 移除注释
[rm-doctype](#rm-doctype) | 无 | 移除 DocType
[rm-hidden](#rm-hidden) | 无 | 移除不可见的内容
[rm-irregular-nesting](#rm-irregular-nesting) | { ignore: string[] } | 移除不规则的嵌套
[rm-irregular-tag](#rm-irregular-tag) | { ignore: string[] } | 移除不规范的标签
[rm-px](#rm-px) | 无 | 移除 px 单位
[rm-unnecessary](#rm-unnecessary) | { tags: string[] } | 移除不必要的 svg 元素
[rm-version](#rm-version) | 无 | 移除 svg 的 version 属性
[rm-viewbox](#rm-viewbox) | 无 | 优化或移除 svg 的 viewbox 属性
[rm-xml-decl](#rm-xml-decl) | 无 | 移除 xml 声明节点
[rm-xmlns](#rm-xmlns) | 无 | 优化并移除不必要的 xml 命名空间
[shorten-animate](#shorten-animate) | { remove: boolean } | 优化动画元素
[shorten-class](#shorten-class) | 无 | 优化 className
[shorten-color](#shorten-color) | { rrggbbaa: boolean } | 优化颜色
[shorten-decimal-digits](#shorten-decimal-digits) | 无 | 优化数值类属性
[shorten-defs](#shorten-defs) | 无 | 优化 defs 节点下的内容
[shorten-filter](#shorten-filter) | 无 | 优化滤镜元素
[shorten-id](#shorten-id) | 无 | 优化 ID
[shorten-shape](#shorten-shape) | 无 | 优化图形类元素
[shorten-style-attr](#shorten-style-attr) | 无 | 优化 style 属性
[shorten-style-tag](#shorten-style-tag) | 无 | 优化 style 标签

### collapse-g

* 默认配置：
```json
{
	"rules": {
		"collapse-g": true
	}
}
```

* 说明：
	* 当 g 元素没有子元素时，移除该元素
	* 当 g 元素没有属性值时，用子元素替换该元素
	* 当 g 元素只有一个子元素，且自身没有 id、class、mask 属性时，将 g 元素的属性复制到子元素，并用子元素替换之

例如：
```xml
<g></g>
<g fill="red"><rect width="100" height="100"/></g>
```

优化后将变为：
```xml
<rect fill="red" width="100" height="100"/>
```

### collapse-textwrap

* 默认配置：
```json
{
	"rules": {
		"collapse-textwrap": true
	}
}
```

* 说明：
	* 对于所有嵌套的文本容器，当内部文本容器不包含任何有效属性时，移除该元素，并将文本内容提升为父元素的子节点

例如：
```xml
<text></text>
<text fill="red"><tspan>123</tspan></text>
```

优化后将变为：
```xml
<text fill="red">123</text>
```

### combine-path

* 默认配置：
```json
{
	"rules": {
		"combine-path": [true, {
			"disregardFill": false,
			"disregardOpacity": false
		}]
	}
}
```

* 说明：
	* 合并满足以下条件的路径节点：
		1. 所有属性和样式（包括继承样式）相同
		2. 相邻
		3. 没有 fill
		4. stroke 的透明度不小于 1
		5. 没有 marker-start、marker-mid、marker-end
* 配置参数：
	* disregardFill
		* 默认值：false
		* 是否允许合并满足以下条件的路径：
			1. stroke 为空
			2. fill-rull 不是 evenodd
			3. fill 的透明度不小于 1
	* disregardOpacity
		* 默认值：false
		* 是否允许合并透明度小于 1 的路径

例如：
```xml
<path d="M0,0L100,100" fill="none" stroke="red" stroke-width="2"/>
<path d="M0,50L100,150" fill="none" stroke="red" stroke-width="2"/>
```

优化后将变为
```xml
<path d="M0,0L100,100M0,50L100,150" fill="none" stroke="red" stroke-width="2"/>
```

### combine-transform

* 默认配置：
```json
{
	"rules": {
		"combine-transform": true
	}
}
```

* 说明：
	* 分析并合并 transform 属性

例如：
```xml
<rect fill="red" width="100" height="100" transform="translate(100,100)scale(2)rotate(180)"/>
```

优化后将变为：
```xml
<rect fill="red" width="100" height="100" transform="matrix(-2,0,0,-2,100,100)"/>
```

### compute-path

* 默认配置：
```json
{
	"rules": {
		"compute-path": true
	}
}
```

* 说明：
	* 计算 path 的 d 属性，使之变得更短

例如：
```xml
<path fill="red" d="M0,0L100,0,100,100,0,100z"/>
```

优化后将变为：
```xml
<path fill="red" d="m0,0h100v100H0z"/>
```

### rm-attribute

* 默认配置：
```json
{
	"rules": {
		"rm-attribute": [true, {
			"keepAria": false,
			"keepEvent": false
		}]
	}
}
```

* 说明：
	* 移除非规范的属性（不在[SVG规范](https://www.w3.org/TR/SVG/attindex.html)中，且并非xmlns类的属性）
* 配置参数：
	* keepAria
		* 默认值：false
		* 保留所有的[aria](https://www.w3.org/TR/wai-aria-1.1/)属性，目前默认移除
	* keepEvent
		* 默认值：false
		* 保留所有的[事件监听](https://www.w3.org/TR/SVG/interact.html#TermEventAttribute)属性，目前默认移除

例如：
```xml
<g fill="red">
	<rect fill="black" width="100" height="100" aa="1" bb="2" cc="3" aria-autocomplete="both" onclick="console.log('a');"/>
</g>
```

优化后将变为：
```xml
<g fill="red">
	<rect fill="black" width="100" height="100"/>
</g>
```

### rm-comments

* 默认配置：
```json
{
	"rules": {
		"rm-comments": true
	}
}
```
* 说明：
	* 移除注释

### rm-doctype

* 默认配置：
```json
{
	"rules": {
		"rm-doctype": [true]
	}
}
```
* 说明：
	* 移除 DOCTYPE 声明

### rm-hidden

* 默认配置：
```json
{
	"rules": {
		"rm-hidden": true
	}
}
```
* 说明：
	* 移除 display 属性为 none 的元素
	* 移除 fill 和 stroke 属性均为 none 的图形类元素
	* 移除没有子节点的文本容器
	* 移除其它因某些原因不渲染的图形元素

以下内容将被移除：

display 为 none
```xml
<g style="display:none"></g>
```

stroke 和 fill 均为 none
```xml
<rect fill="none" stroke="none" width="100" height="100"/>
```

use 元素引用了不存在的 id
```xml
<use href="#undefined"/>
```

一些因尺寸属性为 0 导致不可见的元素，例如：
```xml
<pattern id="pattern-1" width="0" height="0" />
```

### rm-irregular-nesting

* 默认配置：
```json
{
	"rules": {
		"rm-irregular-nesting": [true, {
			"ignore": []
		}]
	}
}
```
* 说明：
	* 移除不规范嵌套的标签
* 配置参数：
	* ignore
		* 默认值：\[]
		* 限制为字符串列表，如果元素的标签名在列表中，则该元素及子元素均不会验证嵌套规则

例如：
```xml
<rect fill="red" width="100px" height="100px"><circle cx="100" cy="100" r="100"/></rect>
```

优化后将变为：
```xml
<rect fill="red" width="100" height="100"/>
```

### rm-irregular-tag

* 默认配置：
```json
{
	"rules": {
		"rm-irregular-tag": [true, {
			"ignore": []
		}]
	}
}
```
* 说明：
	* 移除不在[SVG规范](https://www.w3.org/TR/SVG/eltindex.html)内的标签
* 配置参数：
	* ignore
		* 默认值：\[]
		* 限制为字符串列表，如果元素的标签名在列表中，则该元素虽然不是规范的 SVG 标签，也不会被移除

### rm-px

* 默认配置：
```json
{
	"rules": {
		"rm-px": true
	}
}
```
* 说明：
	* 移除 px 单位及 0 值的单位

例如：
```xml
<rect fill="red" width="100px" height="100px" rx="0pt"/>
```

优化后将变为：
```xml
<rect fill="red" width="100" height="100" rx="0"/>
```

### rm-unnecessary

* 默认配置：
```json
{
	"rules": {
		"rm-unnecessary": [true, {
			"tags": ["desc", "discard", "foreignObject", "video", "audio", "iframe", "canvas", "metadata", "script", "title", "unknown", "image"]
		}]
	}
}
```
* 说明：
	* 移除不必要的标签
	* **虽然默认并不移除 style 标签，但部分规则（如 shape-to-path）可能会导致样式表中的选择器无法命中**
	* **由于并没有对 javascript 脚本进行分析处理，如果默认不移除 script 标签，不能保证优化后的代码仍然可以正确执行**
* 配置参数：
	* tags
		* 默认值：["desc", "discard", "foreignObject", "video", "audio", "iframe", "canvas", "metadata", "script", "title", "unknown", "image"]
		* 限制为字符串列表
		* 配置需要移除的标签名称，只能移除以下列表中的标签：["desc", "discard", "foreignObject", "video", "audio", "iframe", "canvas", "metadata", "script", "style", "title", "unknown", "image"]

### rm-version

* 默认配置：
```json
{
	"rules": {
		"rm-version": true
	}
}
```
* 说明：
	* 移除 svg 元素的 version 属性

### rm-viewbox

* 默认配置：
```json
{
	"rules": {
		"rm-viewbox": true
	}
}
```
* 说明：
	* 当 x、y、width、height 完全相同时，移除 viewBox 属性

例如：
```xml
<svg width="1000" height="600" viewBox="0 0 1000 600">
```

优化后将变为：
```xml
<svg width="1000" height="600">
```

### rm-xml-decl

* 默认配置：
```json
{
	"rules": {
		"rm-xml-decl": true
	}
}
```
* 说明：
	* 移除 xml 声明

### rm-xmlns

* 默认配置：
```json
{
	"rules": {
		"rm-xmlns": true
	}
}
```
* 说明：
	* 移除未被引用的 xmlns 定义，移除包含未定义命名空间的属性

例如：
```xml
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	<rect fill="red" width="100" height="100"/>
</svg>
```

优化后将变为（由于 xlink 这个 namespace 并没有被引用，所以被移除了）：
```xml
<svg xmlns="http://www.w3.org/2000/svg">
	<rect fill="red" width="100" height="100"/>
</svg>
```

### shorten-animate

* 默认配置：
```json
{
	"rules": {
		"shorten-animate": [true, {
			"remove": false
		}]
	}
}
```
* 说明：
	* 优化动画元素，同时移除不合法的动画元素
* 配置参数
	* remove
		* 默认值：false
		* 不做任何验证，直接移除所有的动画元素

例如：
```xml
<animate/><!-- 没有 attributeName -->
<animate attributeName="title" to="test"/><!-- title 不是 animatable 的属性 -->
<animate attributeName="x"/><!-- 没有 from/to/by/values -->
<animate attributeName="x" to="abc"/><!-- to 的值与 x 不匹配 -->
```

经过优化以上元素都会被移除

### shorten-class

* 默认配置：
```json
{
	"rules": {
		"shorten-class": true
	}
}
```
* 说明：
	* 缩短 className
	* 移除不被引用的 className

例如：
```xml
<style>.red_rect {fill: red;}</style>
<rect class="red_rect blue_rect" width="100" height="100"/>
```

优化后将变为：（.red_rect 被缩短为 .a，.blue_rect 直接被移除）
```xml
<style>.a {fill: red;}</style>
<rect class="a" width="100" height="100"/>
```

### shorten-color

* 默认配置：
```json
{
	"rules": {
		"shorten-color": [true, {
			"rrggbbaa": false
		}]
	}
}
```
* 说明：
	* 尽可能地缩短颜色定义
* 配置参数
	* opacityDigit
		* 默认值：3
		* 限制为 0 或正整数
		* rgba、hsla 格式的颜色 alpha 值的精度
	* rrggbbaa
		* 默认值：false
		* 是否采用 8 位的 16 进制颜色（例如：rgba(255,0,0,0.5) => #ff000080）

例如：
```xml
<rect fill="#ff0000" stroke="rgb(255,255,255)" color="rgba(0,0,0,0)" width="100" height="100"/>
```

优化后将变为：
```xml
<rect fill="red" stroke="#fff" color="transparent" width="100" height="100"/>
```

### shorten-decimal-digits

* 默认配置：
```json
{
	"rules": {
		"shorten-decimal-digits": true
	}
}
```
* 说明：
	* 缩小不同类型的数值精度

例如：
```xml
<rect fill="red" width="100.00001" height="100.00001" fill-opacity="0.05999"/>
```

优化后将变为：
```xml
<rect fill="red" width="100" height="100" fill-opacity="6%"/>
```

### shorten-defs

* 默认配置：
```json
{
	"rules": {
		"shorten-defs": true
	}
}
```
* 说明：
	* 合并所有的 defs 标签
	* 移除无效的 defs 定义
	* 移除空的 defs 标签

例如：
```xml
<defs>
	<circle id="circle-1" fill="#000" cx="60" cy="60" r="60"></circle>
</defs>
<defs>
	<circle fill-opacity="0.599999964" fill="#000000" cx="60" cy="60" r="60"></circle>
</defs>
<mask id="mask-2" fill="white">
	<use xlink:href="#circle-1" />
</mask>
```

优化后将变为：
```xml
<defs>
	<circle id="path-1" fill="#000" cx="60" cy="60" r="60"></circle>
</defs>
<mask id="mask-2" fill="white">
	<use xlink:href="#path-1" />
</mask>
```

### shorten-filter

* 默认配置：
```json
{
	"rules": {
		"shorten-filter": true
	}
}
```
* 说明：
	* 优化 [Filter Elements](https://drafts.fxtf.org/filter-effects/#FilterElement)
	* 移除空的 filter 元素
	* filter 元素的 width 和 height 不能是 0 或负数
	* feComponentTransfer 下不允许重复的 transferFunctionElement
	* transferFunctionElement 根据 type 只保留必要的属性

例如：
```xml
<filter></filter>
<filter>
	<feComponentTransfer>
		<feFuncR type="gamma" amplitude="1" exponent="1" offset="0"/>
		<feFuncR type="linear" amplitude="1" exponent="1" offset="0" slope="2"/>
	</feComponentTransfer>
</filter>
```

优化后将变为：
```xml
<filter>
	<feComponentTransfer>
		<feFuncR type="linear" slope="2"/>
	</feComponentTransfer>
</filter>
```

### shorten-id

* 默认配置：
```json
{
	"rules": {
		"shorten-id": true
	}
}
```
* 说明：
	* 缩短 ID
	* 移除不被引用的 ID

例如：
```xml
<defs>
	<circle id="circle-1" fill="#000" cx="60" cy="60" r="60"></circle>
</defs>
<mask id="mask-2" fill="white">
	<use xlink:href="#circle-1" />
</mask>
<rect id="rect-3" fill="red" width="100" height="100" mask="url(#mask-2)"/>
```

优化后将变为：（#rect-3 被移除，另外 2 个 id 被缩短）
```xml
<defs>
	<circle id="a" fill="#000" cx="60" cy="60" r="60"></circle>
</defs>
<mask id="b" fill="white">
	<use xlink:href="#a" />
</mask>
<rect fill="red" width="100" height="100" mask="url(#b)"/>
```

### shorten-shape(v1.5.0+)

* 默认配置：
```json
{
	"rules": {
		"shorten-shape": true
	}
}
```
* 说明：
	* 如果形状映射到 path 的结果更短，则使用 path
	* 如果 ellipse 形状的 rx 和 ry 相同，则转换为 circle

例如：
```xml
<rect fill="red" width="100" height="100"/>
```

优化后将变为：
```xml
<path fill="red" d="M0,0H100V100H0z"/>
```

### shorten-style-attr

* 默认配置：
```json
{
	"rules": {
		"shorten-style-attr": true
	}
}
```
* 说明：
	* 缩短 style 属性
	* 深度分析 style 属性继承链，移除无可应用对象的属性
	* 如果不存在 style 标签，则根据情况进行 style 和属性的互转

例如：
```xml
<rect fill="red" style="fill:blue;background:red;"/>
```

优化后将变为：（fill 属性将被 style 中的同名定义覆盖，所以被移除了，background 不是标准的 svg 样式，所以也被移除了）
```xml
<rect style="fill:blue;"/>
```

如果 svg 中不存在 style 标签，或 exchange 被设定为 true ，则优化结果为：
```xml
<rect fill="blue"/>
```

### shorten-style-tag

* 默认配置：
```json
{
	"rules": {
		"shorten-style-tag": [true, {
			"deepShorten": true
		}]
	}
}
```
* 说明：
	* 缩短 style 标签的内容
	* 移除重复的定义
	* 移除不在[SVG规范](https://www.w3.org/TR/SVG/propidx.html)内的样式
* 配置参数：
	* deepShorten
		* 默认值：true
		* 移除无效的选择器
		* 合并多个相同的选择器
		* 合并多个相同的规则
