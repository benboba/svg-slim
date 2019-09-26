# 更新日志

## 2019.09.26 v1.4.3

### svg-slimming

* 修复了 shorten-color 优化 rgba 颜色，当 alpha 值小于 1 时结果不正确的 bug
* 修复了 rm-attribute 会意外移除 rgb(r,g,b,a)、rgba(r,g,b)、hsl(h,s,l,a)、hsla(h,s,l) 格式颜色属性的问题

## 2019.09.23 v1.4.2

### svg-slimming

* 修复了 compute-path 对于连续的 M/m 指令只保留最后一组的错误做法，正确做法是将后续的 M/m 指令视为 L/l

## 2019.09.18 v1.4.1

### 综合

* 升级 tslint 到 5.19.0 并更新部分规则

### svg-slimming

* **调整了默认规则的数值精度配置，现在默认数值尺寸类数值将保留小数点后 2 位（涉及规则：combine-transform、compute-path、shorten-decimal-digits）**
* 现在 combine-path 规则会限制 fill-rule 属性不能为 evenodd，避免因未执行路径交叉判断便合并，导致意外的镂空问题
* 修复了 compute-path 规则在只有 M 指令时会报错的一个 bug
* 现在 compute-path 规则在无法解析 d 属性或只有 M 指令时会直接移除 path 节点
* 修正了解析 style 标签的时机，现在不会在一次优化中多次重复的进行 style 标签解析和字符串化
* 将 matchSelector 工具函数柯里化，以保证更加函数式的调用

## 2019.08.27 v1.4.0

### 综合

* 引入了 nyc 进行单元测试覆盖率检验
* 引入 ts-node 对 ts 模块执行单元测试
* 追加大量单元测试，并有针对性地修复了部分 bug（见下文）

### xml-parser

* 修正了 Doctype 正则表达式对引号不匹配的漏检情况
* 修正了 xml-parser.d.ts 导出成员名称不对的 bug

### svg-slimming

* 修正了 svg-slimming.d.ts ，与 xml-parser.d.ts 做对应
* 修正了 config 合并时，没有验证数组类型，导致传入对象或函数可能意外报错的问题
* 现在所有依赖 css 模块进行解析的地方都加了 try ... catch，以应对非法字符串导致 css 模块报错影响优化结果的问题
* 不再使用 toFixed 处理数值，改用 Math.round(Math.abs)，以解决 1.15.toFixed(1) = 1.1 的问题
* 改进了道格拉斯普克算法，现在不会直接修改输入的原始数组，而是会先 clone 一个副本进行计算，最后会返回副本作为计算结果
* 改进了 16 进制颜色的解析，添加了 1% ~ 100% 的对照表，修复了 #00000080 无法正确解析为 rgba(0,0,0,0.5) 的 bug
* 修复了连续解析 rgb|hsl|rgba|hsla 颜色时，正则表达式没有重置的 bug
* 修正了颜色解析逻辑和 W3C 规则不一致的问题，现在 rgb 和 hsl 会处理 alpha 值，rgba 和 hsla 会正确处理不存在 alpha 值的情况，hsl 会处理 hue 的值带单位的情况
* 调整了 shorten-color 限制 alpha 值位数的参数，现在对于所有的颜色 alpha 值，最多保留小数点后第 3 位，和 chrome 浏览器 (v76.0.3809.87) 保持一致
* 修正了属性选择器的正则表达式的一个错误
* combine-script 现在会将合并后的 script 标签移到 svg 元素尾部，并且移除尾分号
* 修复了 skewX 和 skewY 函数合并时直接将角度相加的错误运算方式，改为进行真实的矩阵乘法运算
* 修正了 matrix 的解析规则，现在遇到错误的 matrix 格式会直接跳出，而不会继续解析。现在会全字匹配完整的 matrix 字符串，避免了字符串存在错误依然被正确解析的问题
* 修正了 matrix 转化为简易函数时没有对简易函数再次优化的问题
* 修正了 matrix 优化时遇到 -0 没有正确转为 0 的问题
* 现在会更严格地解析 path，遇到有问题的格式会截断 d 属性，行为和浏览器保持一致
* 现在 path 中椭圆和有旋转角度的 a 指令会正确合并
* 现在 path 中同方向的 l 指令会正确合并，并修复了反方向 h 和 v 指令会被合并的错误
* 修复了 rm-attribute 规则中保留 aria 和保留 eventHandler 两个选项无效的问题
* rm-attribute 现在会验证所有样式类属性的值是否匹配 css 全局关键字 initial、inherit、unset
* rm-attribute 现在会分析样式继承链，虽然当前样式的值是默认值，但如果父元素上存在同名样式，则不会对当前样式进行移除
* rm-attribute 在判断一个属性的值是否是默认值时，除了全字匹配，还会尝试解析数字或颜色类型进行深度对比
* 修复了 rm-hidden 规则没有深度解析样式，可能导致错误删除或未删除的问题
* rm-hidden 规则现在不会直接移除无填充无描边的图形元素，还会判断自身或祖先元素是否存在 id，只有不存在 id 的才会被移除
* rm-irregular-nesting 现在父元素命中了忽略规则后，将不再处理子元素
* 修复了部分 numberlist 属性没有按照 numberlist 解析，导致一些解析错误的问题
* rm-viewbox 规则现在会验证 viewBox 属性解析后长度是否为 4，且 width 和 height 不能为负，此外会正确验证单位，只有单位为 px 的属性才有可能触发 rm-viewbox
* shorten-style-tag 规则现在会移除 comment 和空的 keyframes、 mediaquery、font-face 等 css 节点
* 修复了解析 CSS 选择器时遇到属性、class、id、伪类选择器组合时会错误地只解析到组合最后一个 case 的问题
* 修复了根据选择器获取元素中，兄弟选择器会丢失部分匹配项的问题

## 2019.03.29 v1.3.4

### svg-slimming

* 改进了 rm-attribute 规则中对动画属性引用的判断逻辑，修复了意外删除 feColorMatrix 的 values 属性的 bug

## 2019.03.14 v1.3.3

### 综合

* 采用了更严格的 tslint 规范，并统一了代码格式

### svg-slimming

* 进一步改进了 shorten-style-tag 的优化结果，现在会验证每一条 css 规则的有效性，去除无效的 css 规则

例如：

	<svg><style>#redText{fill:yellow;marker-end:none}</style><text id="redText">123</text></svg>

现在会优化为：

	<svg><style>#redText{fill:yellow}</style><text id="redText">123</text></svg>

## 2019.03.13 v1.3.2

### svg-slimming

* 解决了 style/check-apply 命中穿透情况的一个 badcase

例如：

	<svg><g id="a" fill="red"><rect fill="white"/><g fill="blue"><rect/></g></g></svg>

旧的优化结果为：

	<svg><g id="a" fill="red"><rect fill="white"/><rect fill="blue"/></g></svg>

现在会优化为：

	<svg><g id="a"><rect fill="white"/><rect fill="blue"/></g></svg>

## 2019.03.12 v1.3.1

### 综合

* 升级 lodash 到 4.17.11 以修复潜在的安全漏洞
* 将更新日志从 README.md 中拆分出来

### svg-slimming

* 在 shorten-style-tag 规则中也添加了 style/check-apply 的依赖
* 改进了 style/check-apply 模块，现在会验证样式最终的有效可应用元素，当样式继承链上不存在有效的可应用元素时，会移除该样式
* 修复了 style/check-apply 的一个误判 bug

## 2019.01.11 v1.3.0

### svg-slimming

* 升级 tslint，采用了更严格的规范
* 在 tsconfig 中开启 strict 模式
* 增加了对 [he](https://www.npmjs.com/package/he) 的依赖，修复解析 style 属性时遇到 HTML entities 导致解析失败的 bug
* 调整了 id 属性的验证规则，修复了因 id 验证导致不正确移除 id 属性的 bug
* 在颜色合法性验证中添加了 rebeccapurple 关键字的支持
* 调整了 collapse-g 规则，如果父元素具有 style 属性，则不可以合并，否则可能导致错误的样式覆盖
* 调整了 combine-path 规则，现在不会合并 fill 或 stroke 的透明度小于 1 的情况
* 为 combine-path 增加 2 个配置参数：1、是否合并 stroke 属性为 none 的路径；2、是否无视透明度进行合并

## 2019.01.03 v1.2.14

### svg-slimming

* 现在 compute-path 规则会把路径末尾的移动指令(m M)移除
* 修复了解析 css 伪类伪元素失败的 bug
* 为 shorten-style-tag 规则增加了伪类和伪元素的验证，按 [SVG 规范](https://www.w3.org/TR/SVG2/styling.html#RequiredCSSFeatures)，只验证 CSS 2.1 规范的伪类和部分伪元素

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