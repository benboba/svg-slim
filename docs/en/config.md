# Optimized Configuration

The optimized configuration is an object in JSON format and currently supports three attributes: rules, params, and browsers.

Here is an example of using optimized configuration:

```ts
const svgSlim = require('svg-slim');
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
svgSlim(svgcode, userConfig);
```

## Params

params currently supports the following configuration items

Property | Type | Default Value | Remarks
---- | ---- | ---- | ----
sizeDigit | number | 2 | Accuracy of displacement data
angelDigit | number | 2 | Accuracy of angle data
trifuncDigit | number | 3 | Accuracy of trigonometric function data
opacityDigit | number | 3 | Accuracy of opacity data
thinning | number | 0 | Optimize the path by thinning out nodes, 0 means no thinning out, and greater than 0 means thinning out the node threshold
straighten | number | 0 | Convert a small-size curve to a straight line, 0 means no optimization is performed, and greater than 0 means the threshold of the curve to a straight line
mergePoint | number | 0 | Whether to merge points with similar distances in the path, 0 means that this optimization is not performed
rmAttrEqDefault | boolean | true | Whether to remove the same style as the default value
exchangeStyle | boolean | false | Whether to ignore the existence of the style tag and force the conversion between styles and attributes (**Warning!** svg's style coverage rule is style attribute> style tag> attribute, so enabling this configuration item may lead to incorrect coverage!)
ignoreKnownCSS | boolean | false | Whether to retain the CSS style that cannot be used as [property](https://www.w3.org/TR/SVG/propidx.html) (**Warning!**, many CSS3 properties are not in this list, but they are still valid for SVG elements in some modern browsers)

## Browsers

Browsers configuration depends on [browserslist](https://github.com/browserslist/browserslist#readme), you can pass in a string/string list here, or configure the "browserslist" property in package.json

## Rules

The following is a complete list of optimization rules. Some optimization rules contain additional configuration items.

All rules are turned on by default, and you can turn them off by optimizing the configured rules.

Name | Configuration Item | Remarks
---- | ---- | ----
[apply-style](rules/apply-style.md) | None | Apply style to target element
[collapse-g](rules/collapse-g.md) | None | Collapse unnecessary g elements
[collapse-textwrap](rules/collapse-textwrap.md) | None | Collapse unnecessary text nodes
[combine-path](rules/combine-path.md) | { disregardFill: boolean, disregardOpacity: boolean } | Combine adjacent path elements
[combine-transform](rules/combine-transform.md) | None | Combine transform function
[compute-path](rules/compute-path.md) | None | Calculate and optimize the path
[rm-attribute](rules/rm-attribute.md) | { keepAria: boolean, keepEvent: boolean } | Remove unnecessary attributes
[rm-comments](rules/rm-comments.md) | None | Remove comment
[rm-doctype](rules/rm-doctype.md) | None | Remove DocType
[rm-hidden](rules/rm-hidden.md) | None | Remove invisible content
[rm-illegal-style](rules/rm-illegal-style.md) | None | Remove the irregular style attribute
[rm-irregular-nesting](rules/rm-irregular-nesting.md) | { ignore: string\[] } | Remove irregular nesting
[rm-irregular-tag](rules/rm-irregular-tag.md) | { ignore: string\[] } | Remove irregular tags
[rm-px](rules/rm-px.md) | None | Remove px unit
[rm-unnecessary](rules/rm-unnecessary.md) | { tags: string\[] } | Remove unnecessary svg elements
[rm-version](rules/rm-version.md) | None | Remove the version attribute of svg
[rm-viewbox](rules/rm-viewbox.md) | None | Optimize or remove the viewbox attribute of svg
[rm-xml-decl](rules/rm-xml-decl.md) | None | Remove xml declaration node
[rm-xmlns](rules/rm-xmlns.md) | None | Optimize and remove unnecessary xml namespace
[shorten-animate](rules/shorten-animate.md) | { remove: boolean } | Optimize animation elements
[shorten-class](rules/shorten-class.md) | None | Optimization className
[shorten-color](rules/shorten-color.md) | { rrggbbaa: boolean } | Optimize color
[shorten-decimal-digits](rules/shorten-decimal-digits.md) | None | Optimize numeric attributes
[shorten-defs](rules/shorten-defs.md) | None | Optimize the content under the defs node
[shorten-filter](rules/shorten-filter.md) | None | Optimize filter elements
[shorten-id](rules/shorten-id.md) | None | Optimization ID
[shorten-shape](rules/shorten-shape.md) | None | Optimize graphic elements
[shorten-style-attr](rules/shorten-style-attr.md) | None | Optimize the style attribute
[shorten-style-tag](rules/shorten-style-tag.md) | { deepShorten: boolean } | Optimize style tag
[style-to-class](rules/style-to-class.md) | None | Create className for repeated style attributes
