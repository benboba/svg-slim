# svg-slim

[![npm version](https://badge.fury.io/js/svg-slim.svg)](https://badge.fury.io/js/svg-slim)

 [中文版](./README-cn.md)

## Change Log

[View change log](./CHANGELOG.md)

## Introduction

svg-slim is an SVG compression tool that provides rich customization and follows the [W3C SVG specification](https://www.w3.org/TR/SVG/)

## Installation
```
npm install svg-slim
```

or

```
yarn add svg-slim
```

## Use
```js
import svgSlim from 'svg-slim';
svgSlim(svgcode[, config]).then(result => {
	console.log(result);
});
```

Where svgcode is svg text in string format and config is user-defined [optimized configuration](docs/en/config.md)

### Optimized Configuration

View the main item [optimized configuration](docs/en/config.md)

### Use online

[svg-slim-web](https://benboba.github.io/svg-slim-web/)

### Use svg-slim-loader

[svg-slim-loader](https://github.com/benboba/svg-slim-loader) is a loader plugin for webpack, which supports optimization of imported SVG files

### Use postcss-svg-slim

[postcss-svg-slim](https://github.com/benboba/postcss-svg-slim) is a plugin for postcss that supports optimizing inline SVG in CSS

### Use rollup-plugin-svg-slim

[rollup-plugin-svg-slim](https://github.com/benboba/rollup-plugin-svg-slim) is a rollup plugin that supports SVG optimization in rollup

## Why choose svg-slim?

* Rich and powerful functions, enough personalized configuration parameters
* Pursue the ultimate optimization effect
* Try not to destroy the original svg effect
* Follow the latest svg specifications

# Sponsor the developer

If you think this project is helpful to you, sponsors are welcome.

[<img src="docs/assets/paypal.png" width="420">](https://www.paypal.com/paypalme/benboba)
<p><img src="docs/assets/alipay.png" width="420"></p>
<p><img src="docs/assets/wechat.png" width="420"></p>
