# 更新日志

[查看更新日志](https://github.com/benboba/svg-slimming/blob/master/UPDATE-zh.md)

# SVG瘦身工具【svg slimming】

## 简介

SVG瘦身工具是一款提供了丰富自定义功能的 SVG 压缩工具，遵循 W3C 的 [SVG 规范](https://www.w3.org/TR/SVG/) 

## 安装
```
	npm install svg-slimming
```

## 使用
```js
	const svgSlimming = require('svg-slimming');
	svgSlimming(svgcode[, config]).then(result => {
		console.log(result);
	});
```

其中 svgcode 为字符串格式的 svg 文本，config 为用户自定义的优化配置

### 使用 svg-slimming-loader

[svg-slimming-loader](https://github.com/benboba/svg-slimming-loader) 是 webpack 的 loader 插件，支持对 import 的 SVG 文件进行优化

### 使用 postcss-svg-slimming

[postcss-svg-slimming](https://github.com/benboba/postcss-svg-slimming) 是 postcss 的插件，支持优化 CSS 中内联的 SVG

## 为什么选择 svg-slimming？

* 丰富而强大的功能，足够个性化的配置参数
* 追求极致的优化效果
* 尽可能不破坏原有的 svg 效果
* 遵循最新的 svg 规范

### vs svgo

| 优化分类 | 优化项目 | svg-slimming | svgo |
| ---- | ---- | ---- | ---- |
| 基本 | svg 解析 | 自己写的解析器 xml-parser | sax |
| 基本 | 非 svg 的 xml 节点处理逻辑 | 移除 | 报错 |
| 基本 | 超大 svg 处理 | × | √ |
| 基本 | 压缩冗余空白 | √ | √ |
| 基本 | 移除注释 | √ | √ |
| 基本 | 移除 xml declaration 和 doctype | √ | √ |
| 基本 | 合并文本节点 | √ | √ |
| 基本 | 支持优化 CDATA 节点 | √ | × |
| 元素 | 移除不必要的元素 | √ | √ |
| 元素 | 移除不可见元素 | √ | √ |
| 元素 | 塌陷不必要的 group 节点 | √ | √ |
| 元素 | 塌陷不必要的文本容器节点 | √ | × |
| 元素 | 移除不符合 svg 规范的元素 | √ | √ |
| 元素 | 优化不规范的元素嵌套 | √ | √ |
| 元素 | 优化 defs | √ | √ |
| 元素 | 直接应用 defs 到元素 | × | √ |
| svg 元素 | viewBox vs 尺寸 | 优先使用尺寸 | 优先使用 viewBox |
| svg 元素 | 移除 version 属性 | √ | √ |
| svg 元素 | 优化 xmlns | √ | √ |
| path 元素 | 经过计算优化 path 的 d 属性 | √ | √ |
| path 元素 | 抛弃空的子路径 | √ | × |
| path 元素 | 移除连续直线指令的无效途经点 | √ | × |
| path 元素 | 特定条件下合并 a 指令 | √ | × |
| path 元素 | 抽稀路径节点 | √ | × |
| path 元素 | 小尺寸曲线指令转直线指令 | v1.5.0 | √ |
| path 元素 | 移除 a 指令 flag 后置空格 | v1.5.0 | √ |
| path 元素 | 合并 path | √ | √ |
| shape | shape 转 path | √ | √ |
| shape | 移除空的 shape（例如半径为 0 的 circle、宽高为 0 的 rect 等） | √ | × |
| shape | ellipsis 和 circle 互转 | v1.5.0 | √ |
| shape | 支持抽稀路径节点优化 polyline 和 polygon | √ | × |
| 属性 | 移除空属性 | √ | √ |
| 属性 | 移除无效属性和不合法属性 | √ | × |
| 属性 | 移除和默认值相同的属性 | √ | × |
| 属性 | 通过分析样式继承链优化属性 | √ | × |
| 属性 | 缩短 ID | √ | √ |
| 属性 | 移除 px 单位 | √ | √ |
| 属性 | 移除不必要的 fill 和 stroke | × | √ |
| 数字 | 优化数字 | √ | √ |
| 数字 | 精确优化不同类型的数值 | √ | × |
| 数字 | 数字转科学计数法 | √ | × |
| 矩阵 | 合并和缩短 transform | √ | √ |
| 矩阵 | 直接把 transform 应用到属性 | × | √ |
| 颜色 | 优化颜色 | √ | √ |
| 颜色 | 支持 hsl/hsla 格式颜色 | √ | × |
| 颜色 | 支持 rgba 格式颜色 | √ | × |
| 颜色 | 支持 #rrggbbaa 格式的 16 进制颜色 | √ | × |
| css | css 解析 | css | csso |
| css | 合并 style 元素 | √ | × |
| css | 优化 style 内容 | √ | √ |
| css | 缩短 className | √ | × |
| css | style 转属性 | √ | √ |
| css | 属性转 style | √（存在 badcase） | × |
| css | 移除 svg 不支持的 css 样式 | √（存在 badcase） | × |
| css | 直接把 style 内容应用到元素 | × | √ |

## 优化配置

优化配置是一个 JSON 格式的对象，其中 key 为对应的配置项，value 为数组，数组第一项为规则的开关，第二项（如果有）为规则的详细配置

下面是一个优化配置的示例：
```json
	{
		"collapse-g": [false],
		"combine-transform": [true, {
			"trifuncDigit": 3,
			"sizeDigit": 2,
			"angelDigit": 2
		}]
	}
```

**注意：旧版配置方式虽然也可以生效，但未来可能会移除**
```json
	{
		"collapse-g": false,
		"combine-transform": [true, 3, 2, 2]
	}
```

### collapse-g

* 默认配置：
```json
	{
		"collapse-g": [true]
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
		"collapse-textwrap": [true]
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
		"combine-path": [true, {
			"disregardFill": false,
			"disregardOpacity": false
		}]
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
		"combine-transform": [true, {
			"angelDigit": 2,
			"sizeDigit": 2,
			"trifuncDigit": 3
		}]
	}
```
* 说明：
	* 分析并合并 transform 属性
* 配置参数：
	* angelDigit
		* 默认值：2
		* 限制为 0 或正整数
		* skewX、skewY、rotate 的角度参数精度
	* sizeDigit
		* 默认值：2
		* 限制为 0 或正整数
		* matrix 的 e, f 位置参数精度，translate 参数精度，以及 3 值 rotate 后 2 个参数精度
	* trifuncDigit
		* 默认值：3
		* 限制为 0 或正整数
		* matrix 的 a, b, c, d 位置参数精度，scale 参数精度

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
		"compute-path": [true, {
			"angelDigit": 2,
			"sizeDigit": 2,
			"straighten": 0,
			"thinning": 0
		}]
	}
```
* 说明：
	* 计算 path 的 d 属性，使之变得更短
* 配置参数：
	* angelDigit
		* 默认值：2
		* 限制为 0 或正整数
		* a/A 指令 x-axis-rotation 的精度
	* sizeDigit
		* 默认值：2
		* 限制为 0 或正整数
		* 坐标类型数值的精度
	* straighten
		* 默认值：0
		* 限制为 0 或正整数
		* 将指定阈值内的曲线指令转为更短的直线指令
		* 为 0 表示不执行转换，不为 0 会视为曲线转直线的阈值
	* thinning
		* 默认值：0
		* 限制为 0 或正整数
		* 抽稀路径节点，以获得更短的结果
		* 为 0 表示不执行路径抽稀，不为 0 会视为抽稀节点的阈值

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
		"rm-attribute": [true, {
			"keepAria": false,
			"keepEvent": false,
			"rmDefault": true
		}]
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
	* rmDefault
		* 默认值：true
		* 移除与默认值相同的属性（如果该属性是可继承的，且父元素上具有同名属性，则不可移除）

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
		"rm-comments": [true]
	}
```
* 说明：
	* 移除注释

### rm-doctype

* 默认配置：
```json
	{
		"rm-doctype": [true]
	}
```
* 说明：
	* 移除 DOCTYPE 声明

### rm-hidden

* 默认配置：
```json
	{
		"rm-hidden": [true]
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
		"rm-irregular-nesting": [true, {
			"ignore": []
		}]
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
		"rm-irregular-tag": [true, {
			"ignore": []
		}]
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
		"rm-px": [true]
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
		"rm-unnecessary": [true, {
			"tags": ["desc", "discard", "foreignObject", "video", "audio", "iframe", "canvas", "metadata", "script", "title", "unknown"]
		}]
	}
```
* 说明：
	* 移除不必要的标签
	* **虽然默认并不移除 style 标签，但部分规则（如 shape-to-path）可能会导致样式表中的选择器无法命中**
	* **由于并没有对 javascript 脚本进行分析处理，如果默认不移除 script 标签，不能保证优化后的代码仍然可以正确执行**
* 配置参数：
	* tags
		* 默认值：["desc", "discard", "foreignObject", "video", "audio", "iframe", "canvas", "metadata", "script", "title", "unknown"]
		* 限制为字符串列表
		* 配置需要移除的标签名称，只能移除以下列表中的标签：["desc", "discard", "foreignObject", "video", "audio", "iframe", "canvas", "metadata", "script", "style", "title", "unknown"]

### rm-version

* 默认配置：
```json
	{
		"rm-version": [true]
	}
```
* 说明：
	* 移除 svg 元素的 version 属性

### rm-viewbox

* 默认配置：
```json
	{
		"rm-viewbox": [true]
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
		"rm-xml-decl": [true]
	}
```
* 说明：
	* 移除 xml 声明

### rm-xmlns

* 默认配置：
```json
	{
		"rm-xmlns": [true]
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

### shorten-class

* 默认配置：
```json
	{
		"shorten-class": [true]
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
		"shorten-color": [true, {
			"opacityDigit": 3,
			"rrggbbaa": false
		}]
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
		"shorten-decimal-digits": [true, {
			"angelDigit": 2,
			"sizeDigit": 2
		}]
	}
```
* 说明：
	* 缩小不同类型的数值精度
* 配置参数
	* angelDigit
		* 默认值：2
		* 限制为 0 或正整数
		* 透明度、角度、弧度等类型数值的精度
	* sizeDigit
		* 默认值：2
		* 限制为 0 或正整数
		* 坐标、尺寸类型数值的精度

例如：
```xml
	<rect fill="red" width="100.00001" height="100.00001" fill-opacity="0.05999"/>
```

优化后将变为：
```xml
	<rect fill="red" width="100" height="100" fill-opacity=".06"/>
```

### shorten-defs

* 默认配置：
```json
	{
		"shorten-defs": [true]
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

### shorten-id

* 默认配置：
```json
	{
		"shorten-id": [true]
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
		"shorten-shape": [true, {
			"thinning": 0
		}]
	}
```
* 说明：
	* 如果形状映射到 path 的结果更短，则使用 path
	* 如果 ellipse 形状的 rx 和 ry 相同，则转换为 circle
* 配置参数：
	* thinning
		* 默认值：0
		* 限制为 0 或正整数
		* 对 polygon 和 polyline 抽稀节点，以获得更短的结果
		* 为 0 表示不执行抽稀节点，不为 0 会视为抽稀节点的阈值

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
		"shorten-style-attr": [true, {
			"exchange": false
		}]
	}
```
* 说明：
	* 缩短 style 属性
	* 深度分析 style 属性继承链，移除无可应用对象的属性
	* 如果不存在 style 标签，则根据情况进行 style 和属性的互转
* 配置参数：
	* exchange
		* 默认值：false
		* 无视 style 标签是否存在，强制执行 style 和属性的互转
		* **注意：svg 的样式覆盖规则是 style 属性 > style 标签 > 属性，所以强制转换可能导致不正确的覆盖**

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
		"shorten-style-tag": [true, {
			"deepShorten": true
		}]
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

## 其它优化工作

下面列出的是本工具会主动执行的优化工作

* 移除标签间的空白
* 移除 OtherSect 和 OtherDecl 类型的节点（参见文档下方的 NodeType 说明）
* 无内容的标签自闭合
* 合并所有的 style 标签
* 合并所有的 script 标签
* 合并相邻的文本类型节点或 CDATA 节点
* 合并所有冗余的空白字符
* 从不含文本内容的节点下移除文本子节点
* 如果 CDATA 节点内不包含“<”，则转为普通文本节点

# XML解析工具【xml parser】

## 简介

在项目里附带了一个 XML 解析工具，安装项目后即可直接使用，无需额外安装。

## 使用
```js
	const xmlParser = require('svg-slimming/xml-parser.js');
	
	xmlParser.parse(xmlcode).then(result => {
		console.log(result);
	});
	
	console.log(xmlParser.NodeType);
```

其中 xmlcode 为字符串格式的 xml 文本（不限于svg）

## 节点类型（NodeType）

节点类型尽可能遵循 DOM 规范的定义 [参考文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType)

具体定义如下：

* 元素节点 | Tag
	* value：1
	* nodeName：\<tagName>
	* 包含 attributes 属性和 childNodes 属性


* 文本节点 | Text
	* value：3
	* nodeName：#text
	* 包含 textContent 属性


* CDATA
	* value：4
	* nodeName：#cdata
	* 包含 textContent 属性


* OtherSect
	* value：5
	* nodeName：#\<sectName>
	* 包含 textContent 属性
	* 指除了 CDATA 之外的其它区块，如 <!\[INCLUDE\[...\]\]>


* OtherDecl
	* value：6
	* nodeName：#\<declName>
	* 包含 textContent 属性
	* 指除了 DocType 之外的其它声明，如 <!ENTITY ... >


* xml声明 | XMLDecl
	* value：7
	* nodeName：#xml-decl
	* 包含 textContent 属性


* 注释 | Comments
	* value：8
	* nodeName：#comments
	* 包含 textContent 属性


* document节点 | Document
	* value：9
	* nodeName：#document
	* 包含 childNodes 属性
	* 为 xml-parser 解析后输出的根节点对象


* DocType
	* value：10
	* nodeName：#doctype
	* 包含 textContent 属性


## 节点定义（typescript 格式）
```ts
	interface INode {
		nodeName: string; // 节点名称
		nodeType: NodeType; // 节点类型
		namespace?: string; // 命名空间（如果有）
		textContent?: string; // 文本内容（如果有）

		readonly attributes?: IAttr[]; // 属性列表（如果有）
		readonly childNodes?: INode[]; // 子节点（如果有）

		parentNode?: INode; // 父节点

		cloneNode(): INode;

		appendChild(childNode: INode): void; // 插入子节点
		insertBefore(childNode: INode, previousTarget: INode): void; // 在某个指定的子节点之前插入子节点
		replaceChild(childNode: INode, ...children: INode[]): void; // 替换某个子节点
		removeChild(childNode: INode): void; // 移除某个子节点

		hasAttribute(name: string, namespace?: string): boolean;
		getAttribute(name: string, namespace?: string): string; // 获取某个属性的值
		setAttribute(name: string, value: string, namespace?: string): void; // 设置某个属性的值
		removeAttribute(name: string, namespace?: string): void; // 移除某个属性
	}
```

## 属性定义（typescript 格式）
```ts
	interface IAttr {
		name: string; // 属性名称（不含命名空间）
		value: string; // 值
		fullname: string; // 属性完整名称（含命名空间）
		namespace?: string; // 属性命名空间
	}
```

## 这个 xml 解析工具有什么优点？

* 严格遵循 xml 规范，遇到不符合规范的 xml 文本会报错，而不是尝试修复
* 支持解析 xml 声明、doctype、注释、CDATA等类型的节点
* 会正确解析 xml 的命名空间
* 会正确解析元素节点的属性，包括含命名空间的属性
* 严格反映原始文档的内容顺序和格式，不会做文本节点合并等额外的事
