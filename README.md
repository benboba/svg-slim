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

## Use
```js
const svgSlim = require('svg-slim');
svgSlim(svgcode[, config]).then(result => {
	console.log(result);
});
```

Where svgcode is svg text in string format and config is user-defined optimized configuration

### Optimized Configuration

View the main item [Optimization Configuration](docs/en/config.md)

### Use svg-slim-loader

[svg-slim-loader](https://github.com/benboba/svg-slim-loader) is a loader plugin for webpack, which supports optimization of imported SVG files

### Use postcss-svg-slim

[postcss-svg-slim](https://github.com/benboba/postcss-svg-slim) is a plugin for postcss that supports optimizing inline SVG in CSS

## Why choose svg-slim?

* Rich and powerful functions, enough personalized configuration parameters
* Pursue the ultimate optimization effect
* Try not to destroy the original svg effect
* Follow the latest svg specifications

### vs svgo

| Optimization classification | Optimization project | svg-slim | svgo |
| ---- | ---- | ---- | ---- |
| Basic | svg parsing | [svg-vdom](https://www.npmjs.com/package/svg-vdom) | sax |
| Basic | Non-svg xml node processing logic | Report error(v2.0.0) | Report error |
| Basic | Oversized svg processing | 1.5.3 | √ |
| Basic | Compressing Redundant Blanks | √ | √ |
| Basic | Remove Comments | √ | √ |
| Basic | Remove xml declaration and doctype | √ | √ |
| Basic | Merging Text Nodes | √ | √ |
| Basic | Support optimization CDATA node | √ | × |
| Elements | Remove unnecessary elements | √ | √ |
| Elements | Remove Invisible Elements | √ | √ |
| Elements | Collapse unnecessary group nodes | √ | √ |
| Elements | Collapse unnecessary text container nodes | √ | × |
| Elements | remove elements that do not conform to the svg specification | √ | √ |
| Elements | Optimize nesting of irregular elements | √ | √ |
| Elements | optimization defs | √ | √ |
| Elements | Apply defs directly to the element | v1.5.3 | √ |
| svg element | viewBox vs size | size preferred | viewbox preferred |
| svg element | remove version attribute | √ | √ |
| svg element | optimization xmlns | √ | √ |
| path element | d attribute of path optimized by calculation | √ | √ |
| path element | discard empty subpaths | √ | × |
| path element | remove invalid waypoints for continuous line instructions | √ | × |
| path element | merge a instruction under certain conditions | √ | × |
| path element | thinning path node | √ | × |
| path element | small size curve command to line command | v1.5.0 | √ |
| path element | remove a directive flag trailing space | v1.5.0 | √ |
| path element | merge path | √ | √ |
| shape | shape to path | √ | √ |
| shape | remove empty shapes (such as circle with radius 0, rect with width and height 0, etc.) | √ | × |
| shape | ellipsis and circle rotation | v1.5.0 | √ |
| shape | support thinning path node optimization polyline and polygon | √ | × |
| Attributes | Remove empty attributes | √ | √ |
| Attributes | Remove invalid and illegal attributes | √ | × |
| Attributes | Remove attributes with the same default values | √ | × |
| Attributes | Optimize attributes by analyzing style inheritance chains | √ | × |
| Attributes | Shorten ID | √ | √ |
| Attributes | Remove px units | √ | √ |
| Attributes | Remove unnecessary fills and strokes | × | √ |
| Numbers | Optimize Digital | √ | √ |
| Numbers | Precisely optimize different types of values | √ | × |
| Numbers | Digital to Scientific Notation | √ | × |
| Matrix | merge and shorten transform | √ | √ |
| Matrix | Apply transform directly to attributes | v1.5.2 | √ |
| Color | Optimize Color | √ | √ |
| Color | Support hsl / hsla format color | √ | × |
| Color | Support rgba format color | √ | × |
| Color | Supports hex color in #rrggbbaa format | √ | × |
| css | css parsing | css | csso |
| css | merge style elements | √ | × |
| css | Optimize style content | √ | √ |
| css | shorten className | √ | × |
| css | style to attributes | √ | √ |
| css | attribute to style | √ | × |
| css | remove css styles not supported by svg | √ | × |
| css | Apply style content directly to elements | v2.0.1 | √ |

# Sponsor me

If you think this project is helpful to you, sponsors are welcome.

[<img src="docs/assets/paypal.png" width="420">](https://www.paypal.com/paypalme/benboba)
<p><img src="docs/assets/alipay.png" width="420"></p>
<p><img src="docs/assets/wechat.png" width="420"></p>
