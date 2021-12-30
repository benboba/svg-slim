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

或者

```
yarn add svg-slim
```

## 使用
```js
import svgSlim from 'svg-slim';
svgSlim(svgcode[, config]).then(result => {
	console.log(result);
});
```

其中 svgcode 为字符串格式的 svg 文本，config 为用户自定义的[优化配置](docs/cn/config.md)

### 优化配置

查看主条目[优化配置](docs/cn/config.md)

### 在线使用

[svg-slim-web](https://benboba.github.io/svg-slim-web/)

### 使用 svg-slim-loader

[svg-slim-loader](https://github.com/benboba/svg-slim-loader) 是 webpack 的 loader 插件，支持对 import 的 SVG 文件进行优化

### 使用 postcss-svg-slim

[postcss-svg-slim](https://github.com/benboba/postcss-svg-slim) 是 postcss 的插件，支持优化 CSS 中内联的 SVG

### 使用 rollup-plugin-svg-slim

[rollup-plugin-svg-slim](https://github.com/benboba/rollup-plugin-svg-slim) 是 rollup 的插件，支持在 rollup 中优化 SVG

## 为什么选择 svg-slim？

* 丰富而强大的功能，足够个性化的配置参数
* 追求极致的优化效果
* 尽可能不破坏原有的 svg 效果
* 遵循最新的 svg 规范

# 捐助项目

如果你觉得这个项目对你有帮助，欢迎提供赞助。

[<img src="docs/assets/paypal.png" width="420">](https://www.paypal.com/paypalme/benboba)
<p><img src="docs/assets/alipay.png" width="420"></p>
<p><img src="docs/assets/wechat.png" width="420"></p>
