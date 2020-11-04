# SVG瘦身工具【svg slim】

[![npm version](https://badge.fury.io/js/svg-slim.svg)](https://badge.fury.io/js/svg-slim)

## 更新日志

[查看更新日志](./CHANGELOG-cn.md)

## 简介

SVG瘦身工具是一款提供了丰富自定义功能的 SVG 压缩工具，遵循 W3C 的 [SVG 规范](https://www.w3.org/TR/SVG/) 

## 安装
```
npm install svg-slim
```

## 使用
```js
const svgSlim = require('svg-slim');
svgSlim(svgcode[, config]).then(result => {
	console.log(result);
});
```

其中 svgcode 为字符串格式的 svg 文本，config 为用户自定义的优化配置

### 优化配置

查看主条目[优化配置](docs/cn/config.md)

### 在线使用

[svg-slim-web](https://benboba.github.io/svg-slim-web/)

### 使用 svg-slim-loader

[svg-slim-loader](https://github.com/benboba/svg-slim-loader) 是 webpack 的 loader 插件，支持对 import 的 SVG 文件进行优化

### 使用 postcss-svg-slim

[postcss-svg-slim](https://github.com/benboba/postcss-svg-slim) 是 postcss 的插件，支持优化 CSS 中内联的 SVG

## 为什么选择 svg-slim？

* 丰富而强大的功能，足够个性化的配置参数
* 追求极致的优化效果
* 尽可能不破坏原有的 svg 效果
* 遵循最新的 svg 规范

### vs svgo

| 优化分类 | 优化项目 | svg-slim | svgo |
| ---- | ---- | ---- | ---- |
| 基本 | svg 解析 | [svg-vdom](https://www.npmjs.com/package/svg-vdom) | sax |
| 基本 | 非 svg 的 xml 节点处理逻辑 | 报错(v2.0.0) | 报错 |
| 基本 | 超大 svg 处理 | 1.5.3 | √ |
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
| 元素 | 直接应用 defs 到元素 | v1.5.3 | √ |
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
| 矩阵 | 直接把 transform 应用到属性 | v1.5.2 | √ |
| 颜色 | 优化颜色 | √ | √ |
| 颜色 | 支持 hsl/hsla 格式颜色 | √ | × |
| 颜色 | 支持 rgba 格式颜色 | √ | × |
| 颜色 | 支持 #rrggbbaa 格式的 16 进制颜色 | √ | × |
| css | css 解析 | css | csso |
| css | 合并 style 元素 | √ | × |
| css | 优化 style 内容 | √ | √ |
| css | 缩短 className | √ | × |
| css | style 转属性 | √ | √ |
| css | 属性转 style | √ | × |
| css | 移除 svg 不支持的 css 样式 | √ | × |
| css | 直接把 style 内容应用到元素 | v2.0.1 | √ |

# 捐助项目

如果你觉得这个项目对你有帮助，欢迎提供赞助。

[<img src="docs/assets/paypal.png" width="420">](https://www.paypal.com/paypalme/benboba)
<p><img src="docs/assets/alipay.png" width="420"></p>
<p><img src="docs/assets/wechat.png" width="420"></p>
