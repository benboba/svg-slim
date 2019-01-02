# 更新日志

## 2019.01.02 v1.2.13

### svg-slimming

* 修复了路径合并可能导致路径渲染移位的 bug
* 修复了多个连续路径不能正确合并为一个的 bug

## 2018.12.29 v1.2.10 ~ v1.2.12

### 综合

* 将 .d.ts 声明文件放置到 package.json 中
* 更新 typescript 版本到 3.2.2
* tsconfig.json 启用更严格的选项
* 放弃 uglifyjs-webpack-plugin，改用 terser-webpack-plugin

### svg-slimming

* 调整了部分规则执行的顺序
* 修复了 matrix 解析已压缩过的代码时可能丢失参数的 bug
* 增加了解析 css 样式树的逻辑
* 路径合并规则调整：1、所有属性相同，包括样式树；2、相邻；3、样式树上的 fill 或 stroke 为 none

## 2018.12.23 v1.2.9

### 综合

* .d.ts 声明文件中，修改 config 参数为可选

### svg-slimming

* 修改了 config 合并的逻辑，由浅拷贝改为逐位对比
* 将 d 属性的数值位数优化，从 shorten-decimal-digit 规则中去除
* 为 compute-path 规则增加两个参数，用于优化 d 属性的数值位数
* 修复了 shorten-class 中不允许重复使用 className 的 bug
* 修复了属性选择器解析的 bug
* 修改了路径合并的规则，现在（暂时）只允许没有 fill 没有 class 没有 id 的路径进行合并
* 修复了路径和矩阵解析时因为属性换行导致优化结果不符合预期的 bug

## 2018.12.21 v1.2.8

### 综合

* 添加了 .d.ts 声明文件

## 2018.11.1 v1.2.7

### svg-slimming

* 修复了对 matrix 执行简单化时，遇到旋转和平移并存的情况只还原了旋转的 bug
* 修复了对样式继承链深度分析时，没有考虑 node 自身具有 xlink:href 属性的 bug

## 2018.10.11 v1.2.6

### svg-slimming

* 修复了 syntax.ts 中一个正则表达式字符集溢出的 bug
* 优化 shape-to-path 规则，现在当 rect 转 path 的时候，会从 hvh 和 vhv 中选择较小的一种情况
* 优化了 combine-transform 的规则，增加了 matrix 反向转为简易函数的逻辑

## 2018.09.19 v1.2.5

### svg-slimming

* 完善了全部属性的合法值验证规则
* 优化 compute-path 规则，现在所有路径函数都支持更多位的参数，以及不合法参数数量的剔除规则
* 为除了 path 之外部分 commaWsp 分隔数字的情况添加了 1 -1 转 1-1，0.5 0.5 转 .5.5 的逻辑
* rm-attribute 规则配置参数1的逻辑改为是否移除与默认值相同的属性

## 2018.09.07 v1.2.4

### svg-slimming

* 添加部分属性的合法值验证规则
* 修复了在判断动画属性时，没有考虑 values 属性的问题
* 修复了对枚举类属性合法值验证错误判断的 bug
* 修复了对 path 元素的 d 属性解析时没有考虑 9+9 或者 .5.5 的情况的bug，同时增加了 0.5 0.5 可以压缩为 .5.5 的逻辑
* 增加了对数字优化时，整数的尾数含有超过 3 位 0 时转科学计数法的逻辑
* 为 combine-transform 规则增加了相邻的同类 transform 函数合并的逻辑，以保证获得更好的优化结果
* 现在 combine-transform 规则支持第四个参数，用于定义角度类数据的精度
* 现在 combine-transform 规则会对原始字符串进行数值精度优化，以保证获得更好的优化结果

## 2018.08.24 v1.2.3

### 综合

* 修正了 README.md 的一些格式问题
* 补全 typescript 类型的定义，保证 no-any 和 no-unsafe-any 规则通过

### xml-parser

* 完善了一些 xml 结构错误，并书写相应的测试用例
* 错误提示的行号判断，由 \\n 改为 \\n \\r \\r\\n 的任意一种

### svg-slimming

* 数字正则表达式添加 i 修饰符，避免科学计数法 e 大写的情况
* transform 类的属性，不再对其应用 shorten-decimal-digits 规则（因其会在 combine-transform 规则中进行优化）
* 修复了 css 属性选择器正则表达式的一个 bug
* fillin 工具兼容了输入字符位数大于规定位数的情况
* rm-xmlns 规则现在支持了节点的命名空间
* combine-path 规则，添加了只有相邻的 path 节点才能合并的限制
* 为 svg-slimming 包添加了属性指向 xmlParser 和 NodeType，可以通过以下方式调用

	const svgSlimming = require('svg-slimming');
	svgSlimming.xmlParser('svg string').then(result => { console.log(result); });
	console.log(svgSlimming.NodeType);

## 2018.08.15 v1.2.2

### 综合

* 增加了 svg-slimming.min.js 和 xml-parser.min.js
* 默认文件指向 svg-slimming.min.js
* 发布到 github ，添加测试用例
* 修复了全局正则表达式 exec 后没有重置位置，导致连续多次解析时结果不正确的问题

### xml-parser

* 修复了解析 OtherDecl 类型正则表达式的错误

### svg-slimming

* compute-path 输出结果中数值的分隔符由空格“ ”改为逗号“,”
* rm-attribute 规则，当移除了不可实现动画的动画属性时，同时移除 attributeName 属性
* rm-hidden 规则，添加了部分 shape 元素没有指定属性的判断

## 2018.08.10 v1.2.1

### svg-slimming

* 进一步完善 shorten-style-tag 的深度优化规则
* 考虑到浏览器兼容性和属性使用频率，暂时将 transform 属性设置为不可转化为 style
* 为 rm-irregular-tag 和 rm-irregular-nesting 规则添加了配置项，可以配置忽略该规则的标签

## 2018.08.09 v1.2.0

### svg-slimming

* 修复了 shorten-class 的一个正则表达式 bug
* 实现了 shorten-style-tag 的深度优化规则
* 完善了标签和属性对应关系和 rm-attribute 规则
* 同步最新的 W3C 规范 (https://www.w3.org/TR/2018/CR-SVG2-20180807/)

## 2018.08.06 v1.1.9

### 综合

* 增加了 svg-slimming.min.js 和 xml-parser.min.js

### svg-slimming

* 修复了 shorten-color 解析 rgb 格式颜色不正确的 bug
* 在 readme.md 中为部分规则添加了优化示意
* 修复了 UglifyJSPlugin 导致 shape-to-path 失效的 bug
* 调整了部分规则的执行顺序，以获得更好的优化效果

## 2018.08.03 v1.1.8

### svg-slimming

* 由于 shape-to-path 规则失效，暂时关闭 UglifyJSPlugin

## 2018.08.03 v1.1.7

### svg-slimming

* 使用 rm-unnecessary 规则，替换原有的 rm-desc、rm-discard、rm-foreign、rm-metadata、rm-title、rm-script、rm-style、rm-unknown 等规则，并添加了可移除 html embed 元素的规则
* 添加了 css 样式在继承链上是否存在可应用对象的判断，兼容 xlink:href 引用

## 2018.08.02 v1.1.6

### 综合

* 启用 UglifyJSPlugin 压缩代码
* 把 NodeType 枚举和INode 和 IAttr 接口提升到全局配置，由 svg-slimming 和 xml-parser 两个项目共同依赖
* 丰富了 INode 接口的功能
	* attributes 和 childNodes 改为只读
	* 增加 parentNode 指针，指向当前节点的父节点
	* 增加 cloneNode 方法，返回当前节点的复制节点，其中 attributes 会深复制， parentNode 和 childNodes 都不会复制
	* 增加 appendChild | insertBefore | removeChild | replaceChild 方法，用于子节点管理
	* 增加 hasAttribute | getAttribute | setAttribute | removeAttribute 方法，用于属性管理

### xml-parser

* 解析出错时，会提示错误的行号和位置
* 节点由接口改为类，并实现 INode 定义的方法

### svg-slimming

* 调整代码，以适应新的 INode 接口
* 增加和完善一些 ts 接口，减少 any 类型
* 为 matrix 混合添加了 skewX 和 skewY 的支持，并添加了遇到不正确的变形函数会终止混合的逻辑
* 实现了 rm-irregular-nesting 规则
* 新增 rm-unknown 和 rm-foreign 规则

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
	* 合并满足以下条件的路径节点： 1、所有属性和样式（包括继承样式）相同；2、相邻；3、没有 fill 或 stroke；4、路径没有相交或包含
	* **路径相交目前只判断了非曲线路径**

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
