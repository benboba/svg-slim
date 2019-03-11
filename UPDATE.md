# 更新日志

## 2019.03.11 v1.3.1

### 综合

* 升级 lodash 到 4.17.11 以修复潜在的安全漏洞
* 将更新日志从 README.md 中拆分出来

### svg-slimming

* 在 shorten-style-tag 规则中也添加了 style/check-apply 的依赖
* 改进了 style/check-apply 模块，现在会验证样式最终的有效可应用元素，当样式继承链上不存在有效的可应用元素时，会移除该样式

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