# 更新日志

[查看更新日志](./UPDATE.md)

# SVG瘦身工具【svg slimming】

## 简介

SVG瘦身工具是一款提供了丰富自定义功能的 SVG 压缩工具，遵循 W3C 的 SVG2 规范 (https://www.w3.org/TR/SVG2/) 。

## 安装

	npm install svg-slimming

## 使用

	const svgSlimming = require('svg-slimming');
	svgSlimming(svgcode[, config]).then(result => {
		console.log(result);
	});

其中 svgcode 为字符串格式的 svg 文本，config 为用户自定义的优化配置

## 优化配置

优化配置是一个 JSON 格式的对象，其中 key 为对应的配置项，value 为布尔值或数组，当value为数组的时候，第一项为配置开关，后续项为扩展配置参数

下面是一个优化配置的示例：

	{
		"collapse-g": false,
		"combine-transform": [true, 4, 2]
	}

### collapse-g

* 默认开关：开
* 说明：
	* 当 g 元素没有子元素时，移除该元素
	* 当 g 元素没有属性值时，用子元素替换该元素
	* 当 g 元素只有一个子元素，且自身没有 id、class、mask 属性时，将 g 元素的属性复制到子元素，并用子元素替换之

例如：

	<g></g>
	<g fill="red"><rect width="100" height="100"/></g>

优化后将变为：

	<rect fill="red" width="100" height="100"/>

### collapse-textwrap

* 默认开关：开
* 说明：
	* 对于所有嵌套的文本容器，当内部文本容器不包含任何有效属性时，移除该元素，并将文本内容提升为父元素的子节点

例如：

	<text></text>
	<text fill="red"><tspan>123</tspan></text>

优化后将变为：

	<text fill="red">123</text>

### combine-path

* 默认开关：开
* 说明：
	* 合并满足以下条件的路径节点： 1、所有属性和样式（包括继承样式）相同；2、相邻；3、没有 fill 或 stroke；4、透明度或颜色透明度不小于 1
* 配置参数1：
	* 默认值：false
	* 遇到 stroke 为空的路径是否进行合并
	* **警告，因为没有进行深度的几何解析，合并 fill 不为空的路径可能会导致意外的镂空情况出现！**
* 配置参数2：
	* 默认值：false
	* 是否无视透明度进行合并

例如：

	<path d="M0,0L100,100" fill="none" stroke="red" stroke-width="2"/>
	<path d="M0,50L100,150" fill="none" stroke="red" stroke-width="2"/>

优化后将变为

	<path d="M0,0L100,100M0,50L100,150" fill="none" stroke="red" stroke-width="2"/>

### combine-transform

* 默认开关：开
* 说明：
	* 分析并合并 transform 属性
* 配置参数1：
	* 默认值：3
	* 合并后的 matrix 的 a, b, c, d 位置的数值精度，以及 scale 函数的参数精度
* 配置参数2：
	* 默认值：1
	* 合并后的 matrix 的 e, f 位置的数值精度，以及 translate 函数的参数精度
* 配置参数3：
	* 默认值：2
	* rotate、skewX、skewY 函数的参数精度

例如：

	<rect fill="red" width="100" height="100" transform="translate(100,100)scale(2)rotate(180)"/>

优化后将变为：

	<rect fill="red" width="100" height="100" transform="matrix(-2,0,0,-2,100,100)"/>

### compute-path

* 默认开关：开
* 说明：
	* 计算 path 的 d 属性，使之变得更短
* 配置参数1：
	* 默认值：false
	* 应用道格拉斯-普克算法抽稀路径节点
* 配置参数2：
	* 默认值：0
	* 抽稀节点的阈值
* 配置参数3：(v1.2.9+)
	* 默认值：1
	* 坐标类型数值的精度
* 配置参数4：(v1.2.9+)
	* 默认值：2
	* 椭圆弧指令中旋转角度数值的精度

例如：

	<path fill="red" d="M0,0L100,0,100,100,0,100z"/>

优化后将变为：

	<path fill="red" d="M0,0H100V100H0z"/>

### douglas-peucker

* 默认开关：关
* 说明：
	* 对 polygon 和 polyline 应用道格拉斯-普克算法抽稀路径节点
* 配置参数1：
	* 默认值：0
	* 抽稀节点的阈值

### rm-attribute

* 默认开关：开
* 说明：
	* 移除非规范的属性（不在[SVG规范](https://www.w3.org/TR/SVG2/attindex.html)中，且并非xmlns类的属性）
* 配置参数1：
	* 默认值：true
	* 移除与默认值相同的属性
* 配置参数2：
	* 默认值：false
	* 保留所有的[事件监听](https://www.w3.org/TR/SVG2/interact.html#TermEventAttribute)属性，目前默认移除
* 配置参数3：
	* 默认值：false
	* 保留所有的[aria](https://www.w3.org/TR/wai-aria-1.1/)属性，目前默认移除

例如：

	<rect fill="red" width="100" height="100" aa="1" bb="2" cc="3" aria-autocomplete="both" onclick="console.log('a');"/>

优化后将变为：

	<rect fill="red" width="100" height="100"/>

### rm-comments

* 默认开关：开
* 说明：
	* 移除注释

### rm-doctype

* 默认开关：开
* 说明：
	* 移除 DOCTYPE 声明

### rm-hidden

* 默认开关：开
* 说明：
	* 移除 display 属性为 none 的元素
	* 移除 fill 和 stroke 属性均为 none 的图形类元素
	* 移除没有子节点的文本容器
	* 移除因某些原因不渲染的图形元素

以下内容将被移除：

display 为 none

	<g style="display:none"></g>

stroke 和 fill 均为 none

	<rect fill="none" stroke="none" width="100" height="100"/>

circle 元素的 r 属性为 0（其它如：rect 元素的 width 或 height 属性为 0，ellipse 元素的 rx 或 ry 为 0，line 元素的长度为 0 等等）

	<circle cx="100" cy="100" r="0"/>

path 元素没有 d 属性或为空（其它如：polyline 和 polygon 元素没有 points 属性或为空等）

	<path id="123" />

### rm-irregular-nesting

* 默认开关：开
* 说明：
	* 移除不规范嵌套的标签
* 配置参数1：
	* 默认值：\[]
	* 配置忽略该规则的标签

例如：

	<rect fill="red" width="100px" height="100px"><circle cx="100" cy="100" r="100"/></rect>

优化后将变为：

	<rect fill="red" width="100" height="100"/>

### rm-irregular-tag

* 默认开关：开
* 说明：
	* 移除不在[SVG规范](https://www.w3.org/TR/SVG2/eltindex.html)内的标签
* 配置参数1：
	* 默认值：\[]
	* 配置忽略该规则的标签

### rm-px

* 默认开关：开
* 说明：
	* 移除 px 单位

例如：

	<rect fill="red" width="100px" height="100px"/>

优化后将变为：

	<rect fill="red" width="100" height="100"/>

### rm-unnecessary

* 默认开关：开
* 说明：
	* 移除不必要的标签
	* **警告！虽然默认并不移除 style 标签，但部分规则（如 shape-to-path）可能会导致样式表中的标签选择器、属性选择器失效！**
	* **警告！由于并没有对 javascript 脚本进行分析处理，如果默认不移除 script 标签，不能保证优化后的代码仍然可以正确执行！**
* 配置参数1：
	* 默认值：['desc', 'discard', 'foreignObject', 'video', 'audio', 'iframe', 'canvas', 'metadata', 'script', 'title', 'unknown']
	* 配置需要移除的标签名称，只能移除以下列表中的标签：['desc', 'discard', 'foreignObject', 'video', 'audio', 'iframe', 'canvas', 'metadata', 'script', 'style', 'title', 'unknown'];

### rm-version

* 默认开关：开
* 说明：
	* 移除 svg 标签的 version 属性

### rm-viewbox

* 默认开关：开
* 说明：
	* 当 x、y、width、height 完全相同时，移除 viewBox 属性

例如：

	<svg width="1000" height="600" viewBox="0 0 1000 600">

优化后将变为：

	<svg width="1000" height="600">

### rm-xml-decl

* 默认开关：开
* 说明：
	* 移除 xml 声明

### rm-xmlns

* 默认开关：开
* 说明：
	* 移除未被引用的 xmlns 定义，移除包含未定义命名空间的属性

例如：

	<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
		<rect fill="red" width="100" height="100"/>
	</svg>

优化后将变为（由于 xlink 这个 namespace 并没有被引用，所以被移除了）：

	<svg xmlns="http://www.w3.org/2000/svg">
		<rect fill="red" width="100" height="100"/>
	</svg>

### shape-to-path

* 默认开关：开
* 说明：
	* 如果形状映射到 path 的结果更短，则使用 path

例如：

	<rect fill="red" width="100" height="100"/>

优化后将变为：

	<path fill="red" d="M0 0H100V100H0z"/>

### shorten-class

* 默认开关：开
* 说明：
	* 缩短 className
	* 移除不被引用的 className

例如：

	<style>.red_rect {fill: red;}</style>
	<rect class="red_rect blue_rect" width="100" height="100"/>

优化后将变为：（存在 red_rect 的引用，所以缩短了，不存在 blue_rect 的引用，所以将被移除）

	<style>.a {fill: red;}</style>
	<rect class="a" width="100" height="100"/>

### shorten-color

* 默认开关：开
* 说明：
	* 尽可能地缩短颜色定义
* 配置参数1
	* 默认值：false
	* 是否缩短 rgba、hsla 格式的颜色到 16 进制
* 配置参数2
	* 默认值：2
	* rgba、hsla 格式的颜色 alpha 值的精度

例如：

	<rect fill="#ff0000" stroke="rgb(255,255,255)" width="100" height="100"/>

优化后将变为：

	<rect fill="red" stroke="#fff" width="100" height="100"/>

### shorten-decimal-digits

* 默认开关：开
* 说明：
	* 缩小数值精度，以获得更好的压缩比
* 配置参数1
	* 默认值：1
	* 坐标、尺寸类型数值的精度
* 配置参数2
	* 默认值：2
	* 透明度、角度、弧度等类型数值的精度

例如：

	<rect fill="red" width="100.00001" height="100.00001" fill-opacity="0.05999"/>

优化后将变为：

	<rect fill="red" width="100" height="100" fill-opacity=".06"/>

### shorten-defs

* 默认开关：开
* 说明：
	* 合并所有的 defs 标签
	* 移除无效的 defs 定义
	* 移除空的 defs 标签

例如：

	<defs>
	    <circle id="circle-1" fill="#000" cx="60" cy="60" r="60"></circle>
	</defs>
	<defs>
	    <circle fill-opacity="0.599999964" fill="#000000" cx="60" cy="60" r="60"></circle>
	</defs>
	<mask id="mask-2" fill="white">
		<use xlink:href="#circle-1" />
	</mask>

优化后将变为：

	<defs>
	    <circle id="path-1" fill="#000" cx="60" cy="60" r="60"></circle>
	</defs>
	<mask id="mask-2" fill="white">
		<use xlink:href="#path-1" />
	</mask>

### shorten-id

* 默认开关：开
* 说明：
	* 缩短 ID
	* 移除不被引用的 ID

例如：

	<defs>
	    <circle id="circle-1" fill="#000" cx="60" cy="60" r="60"></circle>
	</defs>
	<mask id="mask-2" fill="white">
		<use xlink:href="#circle-1" />
	</mask>
	<rect id="rect-3" fill="red" width="100" height="100" mask="url(#mask-2)"/>

优化后将变为：（rect-3 这个 id 没有被引用，所以被移除了，另外 2 个 id 被缩短）

	<defs>
	    <circle id="a" fill="#000" cx="60" cy="60" r="60"></circle>
	</defs>
	<mask id="b" fill="white">
		<use xlink:href="#a" />
	</mask>
	<rect fill="red" width="100" height="100" mask="url(#b)"/>

### shorten-style-attr

* 默认开关：开
* 说明：
	* 缩短 style 属性
	* 深度分析 style 属性继承链，移除无可应用对象的属性
	* 如果不存在 style 标签，则根据情况进行 style 和属性的互转
* 配置参数1
	* 默认值：false
	* 无视 style 标签是否存在，强制执行 style 和属性的互转
	* **警告：svg 的样式覆盖规则是 style 属性 > style 标签 > 属性，所以这个规则可能导致不正确的覆盖！**

例如：

	<rect fill="red" style="fill:blue;background:red;"/>

优化后将变为：（fill 属性将被 style 中的同名定义覆盖，所以被移除了，background 不是标准的 svg 样式，所以也被移除了）

	<rect style="fill:blue;"/>

如果 svg 中不存在 style 标签，或配置参数1被设定为 true ，则优化结果为：

	<rect fill="blue"/>

### shorten-style-tag

* 默认开关：开
* 说明：
	* 缩短 style 标签的内容
	* 移除重复的定义
	* 移除不在[SVG规范](https://www.w3.org/TR/SVG2/propidx.html)内的样式
* 配置参数1
	* 默认值：true
	* 深度分析和优化 style
	* 移除无效的选择器
	* 合并多个相同的选择器
	* 合并多个相同的规则

## 其它优化工作

下面列出的是本工具在配置选项之外的优化工作

* 移除标签间的空白
* 移除 OtherSect 和 OtherDecl 类型的节点（参见本文档下面的 [NodeType 说明](#nodetype)）
* 无内容的标签自闭合
* 合并所有的 style 标签
* 合并所有的 script 标签
* 合并相邻的文本类型节点或 CDATA 节点
* 合并所有冗余的空白字符
* 从不含文本内容的节点下移除文本子节点
* 如果 CDATA 节点内不包含“<”，则转为普通文本节点

## 为什么选择 svg-slimming？

* 支持 W3C 的 SVG2 标准
* 丰富而强大的功能，足够个性化的配置参数
* 追求极致的优化效果

# XML解析工具【xml parser】

## 简介

在项目里附带了一个 XML 解析工具，安装项目后即可直接使用，无需额外安装。

## 使用

	const xmlParser = require('svg-slimming/xml-parser.js');
	
	xmlParser.parse(xmlcode).then(result => {
		console.log(result);
	});
	
	console.log(xmlParser.NodeType);

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

## 属性定义（typescript 格式）

	interface INode {
		name: string; // 属性名称（不含命名空间）
		value: string; // 值
		fullname: string; // 属性完整名称（含命名空间）
		namespace?: string; // 属性命名空间
	}

## 这个 xml 解析工具有什么优点？

* 严格遵循 xml 规范，遇到不符合规范的 xml 文本会报错，而不是尝试修复
* 支持解析 xml 声明、doctype、注释、CDATA等类型的节点
* 会正确解析 xml 的命名空间
* 会正确解析元素节点的属性，包括含命名空间的属性
* 严格反映原始文档的内容顺序和格式，不会做文本节点合并等额外的事
