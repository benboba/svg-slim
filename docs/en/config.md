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
exchangeStyle | boolean | false | Whether to ignore the existence of the style tag and force the conversion between styles and attributes (**warning!** svg's style coverage rule is style attribute> style tag> attribute, so enabling this configuration item may lead to incorrect coverage!)

## Browsers

Browsers configuration depends on [browserslist](https://github.com/browserslist/browserslist#readme), you can pass in a string/string list here, or configure the "browserslist" property in package.json

## Rules

The following is a complete list of optimization rules. Some optimization rules contain additional configuration items.

All rules are turned on by default, and you can turn them off by optimizing the configured rules.

Name | Configuration Item | Remarks
---- | ---- | ----
[collapse-g](#collapse-g) | None | Collapse unnecessary g elements
[collapse-textwrap](#collapse-textwrap) | None | Collapse unnecessary text nodes
[combine-path](#combine-path) | { disregardFill: boolean, disregardOpacity: boolean } | Combine adjacent path elements
[combine-transform](#combine-transform) | None | Combine transform function
[compute-path](#compute-path) | None | Calculate and optimize the path
[rm-attribute](#rm-attribute) | { keepAria: boolean, keepEvent: boolean } | Remove unnecessary attributes
[rm-comments](#rm-comments) | None | Remove comment
[rm-doctype](#rm-doctype) | None | Remove DocType
[rm-hidden](#rm-hidden) | None | Remove invisible content
[rm-irregular-nesting](#rm-irregular-nesting) | { ignore: string\[] } | Remove irregular nesting
[rm-irregular-tag](#rm-irregular-tag) | { ignore: string\[] } | Remove irregular tags
[rm-px](#rm-px) | None | Remove px unit
[rm-unnecessary](#rm-unnecessary) | { tags: string\[] } | Remove unnecessary svg elements
[rm-version](#rm-version) | None | Remove the version attribute of svg
[rm-viewbox](#rm-viewbox) | None | Optimize or remove the viewbox attribute of svg
[rm-xml-decl](#rm-xml-decl) | None | Remove xml declaration node
[rm-xmlns](#rm-xmlns) | None | Optimize and remove unnecessary xml namespace
[shorten-animate](#shorten-animate) | { remove: boolean } | Optimize animation elements
[shorten-class](#shorten-class) | None | Optimization className
[shorten-color](#shorten-color) | { rrggbbaa: boolean } | Optimize color
[shorten-decimal-digits](#shorten-decimal-digits) | None | Optimize numeric attributes
[shorten-defs](#shorten-defs) | None | Optimize the content under the defs node
[shorten-filter](#shorten-filter) | None | Optimize filter elements
[shorten-id](#shorten-id) | None | Optimization ID
[shorten-shape](#shorten-shape) | None | Optimize graphic elements
[shorten-style-attr](#shorten-style-attr) | None | Optimize the style attribute
[shorten-style-tag](#shorten-style-tag) | { deepShorten: boolean } | Optimize style tag

### collapse-g

* Default configuration:
```json
{
	"rules": {
		"collapse-g": true
	}
}
```
* Explanation:
	* When the g element has no children, remove the element
	* When the g element has no attribute value, replace the element with a child element
	* When the g element has only one child element and has no id, class, and mask attributes, copy the attributes of the g element to the child element and replace it with the child element

E.g:
```xml
<g></g>
<g fill="red"><rect width="100" height="100"/></g>
```

After optimization will become:
```xml
<rect fill="red" width="100" height="100"/>
```

### collapse-textwrap

* Default configuration:
```json
{
	"rules": {
		"collapse-textwrap": true
	}
}
```
* Explanation:
	* For all nested text containers, when the inner text container does not contain any valid attributes, remove the element and promote the text content to the child nodes of the parent element

E.g:
```xml
<text></text>
<text fill="red"><tspan>123</tspan></text>
```

After optimization will become:
```xml
<text fill="red">123</text>
```

### combine-path

* Default configuration:
```json
{
	"rules": {
		"combine-path": [true, {
			"disregardFill": false,
			"disregardOpacity": false
		}]
	}
}
```
* Explanation:
	* Merge path nodes that meet the following conditions:
		1. All attributes and styles (including inherited styles) are the same
		2. adjacent
		3. no fill
		4. stroke transparency is not less than 1
		5. No marker-start, marker-mid, marker-end
* Configuration parameters:
	* disregardFill
		* Default: false
		* Whether to allow paths that meet the following conditions:
			1. stroke is empty
			2. fill-rull is not evenodd
			3. The transparency of fill is not less than 1
	* disregardOpacity
		* Default: false
		* Whether to allow paths with transparency less than 1
E.g:
```xml
<path d="M0,0L100,100" fill="none" stroke="red" stroke-width="2"/>
<path d="M0,50L100,150" fill="none" stroke="red" stroke-width="2"/>
```

After optimization will become:
```xml
<path d="M0,0L100,100M0,50L100,150" fill="none" stroke="red" stroke-width="2"/>
```

### combine-transform

* Default configuration:
```json
{
	"rules": {
		"combine-transform": true
	}
}
```
* Explanation:
	* Analyze and merge transform attributes

E.g:
```xml
<rect fill="red" width="100" height="100" transform="translate(100,100)scale(2)rotate(180)"/>
```

After optimization will become:
```xml
<rect fill="red" width="100" height="100" transform="matrix(-2,0,0,-2,100,100)"/>
```

### compute-path

* Default configuration:
```json
{
	"rules": {
		"compute-path": true
	}
}
```
* Explanation:
	* Calculate the d attribute of path to make it shorter

E.g:
```xml
<path fill="red" d="M0,0L100,0,100,100,0,100z"/>
```

After optimization will become:
```xml
<path fill="red" d="m0,0h100v100H0z"/>
```

### rm-attribute

* Default configuration:
```json
{
	"rules": {
		"rm-attribute": [true, {
			"keepAria": false,
			"keepEvent": false
		}]
	}
}
```
* Explanation:
	* Remove non-canonical attributes (not in [SVG spec](https://www.w3.org/TR/SVG/attindex.html) and not attributes of the xmlns class)
* Configuration parameters:
	* keepAria
		* Default: false
		* Keep all [aria](https://www.w3.org/TR/wai-aria-1.1/) attributes, currently removed by default
	* keepEvent
		* Default: false
		* Keep all [Event Monitoring](https://www.w3.org/TR/SVG/interact.html#TermEventAttribute) attributes, currently removed by default

E.g:
```xml
<g fill="red">
	<rect fill="black" width="100" height="100" aa="1" bb="2" cc="3" aria-autocomplete="both" onclick="console.log('a');"/>
</g>
```

After optimization will become:
```xml
<g fill="red">
	<rect fill="black" width="100" height="100"/>
</g>
```

### rm-comments

* Default configuration:
```json
{
	"rules": {
		"rm-comments": true
	}
}
```
* Explanation:
	* Remove comment

### rm-doctype

* Default configuration:
```json
{
	"rules": {
		"rm-doctype": true
	}
}
```
* Explanation:
	* Remove DOCTYPE declaration

### rm-hidden

* Default configuration:
```json
{
	"rules": {
		"rm-hidden": true
	}
}
```
* Explanation:
	* Remove elements with display attribute none
	* Removed graphic elements with fill and stroke properties of none
	* Remove text container without children
	* Remove other graphic elements that are not rendered for some reason

The following will be removed:

display IS none
```xml
<g style="display:none"></g>
```

stroke and fill are none
```xml
<rect fill="none" stroke="none" width="100" height="100"/>
```

use element references a non-existing id
```xml
<use href="#undefined"/>
```

Some elements that are not visible because the size attribute is 0, e.g:
```xml
<pattern id="pattern-1" width="0" height="0" />
```

### rm-irregular-nesting

* Default configuration:
```json
{
	"rules": {
		"rm-irregular-nesting": [true, {
			"ignore": []
		}]
	}
}
```
* Explanation:
	* Remove irregularly nested tags
* Configuration parameters:
	* ignore
		* Default:\[]
		* Restricted to a list of strings. If the tag name of an element is in the list, neither the element nor its child elements will validate the nesting rules.

E.g:
```xml
<rect fill="red" width="100px" height="100px"><circle cx="100" cy="100" r="100"/></rect>
```

After optimization will become:
```xml
<rect fill="red" width="100" height="100"/>
```

### rm-irregular-tag

* Default configuration:
```json
{
	"rules": {
		"rm-irregular-tag": [true, {
			"ignore": []
		}]
	}
}
```
* Explanation:
	* Remove tags that are not in [SVG Specification](https://www.w3.org/TR/SVG/eltindex.html)
* Configuration parameters:
	* ignore
		* Default:\[]
		* Restricted to a list of strings. If the tag name of an element is in the list, the element will not be removed although it is not a standard SVG tag

### rm-px

* Default configuration:
```json
{
	"rules": {
		"rm-px": true
	}
}
```
* Explanation:
	* Remove px units and 0 units

E.g:
```xml
<rect fill="red" width="100px" height="100px" rx="0pt"/>
```

After optimization will become:
```xml
<rect fill="red" width="100" height="100" rx="0"/>
```

### rm-unnecessary

* Default configuration:
```json
{
	"rules": {
		"rm-unnecessary": [true, {
			"tags": ["desc", "discard", "foreignObject", "video", "audio", "iframe", "canvas", "metadata", "script", "title", "unknown", "image"]
		}]
	}
}
```
* Explanation:
	* Remove unnecessary tags
	* **Although style tags are not removed by default, some rules (such as shape-to-path) may cause selectors in the style sheet to fail to match**
	* **As there is no analysis and processing of javascript scripts, if the script tag is not removed by default, there is no guarantee that the optimized code can still be executed correctly**
* Configuration parameters:
	* tags
		* Default: ["desc", "discard", "foreignObject", "video", "audio", "iframe", "canvas", "metadata", "script", "title", "unknown", "image"]
		* Restricted to a list of strings
		* Configure the tag names to be removed. Only tags in the following list can be removed: ["desc", "discard", "foreignObject", "video", "audio", "iframe", "canvas", "metadata", "script", "style", "title", "unknown", "image"]

### rm-version

* Default configuration:
```json
{
	"rules": {
		"rm-version": true
	}
}
```
* Explanation:
	* Remove version attribute from svg element

### rm-viewbox

* Default configuration:
```json
{
	"rules": {
		"rm-viewbox": true
	}
}
```
* Explanation:
	* When x, y, width, height are exactly the same, remove viewBox property

E.g:
```xml
<svg width="1000" height="600" viewBox="0 0 1000 600">
```

After optimization will become:
```xml
<svg width="1000" height="600">
```

### rm-xml-decl

* Default configuration:
```json
{
	"rules": {
		"rm-xml-decl": true
	}
}
```
* Explanation:
	* Remove xml declaration

### rm-xmlns

* Default configuration:
```json
{
	"rules": {
		"rm-xmlns": true
	}
}
```
* Explanation:
	* Remove unreferenced xmlns definitions, remove attributes containing undefined namespaces

E.g:
```xml
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	<rect fill="red" width="100" height="100"/>
</svg>
```

After optimization will become(Since the xlink namespace is not referenced, it was removed):
```xml
<svg xmlns="http://www.w3.org/2000/svg">
	<rect fill="red" width="100" height="100"/>
</svg>
```

### shorten-animate

* Default configuration:
```json
{
	"rules": {
		"shorten-animate": [true, {
			"remove": false
		}]
	}
}
```
* Explanation:
	* Optimize animation elements and remove illegal animation elements
* Configuration parameters:
	* remove
		* Default: false
		* Remove all animation elements without any verification

E.g:
```xml
<animate/><!-- no attributeName -->
<animate attributeName="title" to="test"/><!-- title is not animatable attribute -->
<animate attributeName="x"/><!-- no from/to/by/values -->
<animate attributeName="x" to="abc"/><!-- the value of to does not match x -->
```

After optimization, the above elements will be deleted.

### shorten-class

* Default configuration:
```json
{
	"rules": {
		"shorten-class": true
	}
}
```
* Explanation:
	* Shorten className
	* Remove unreferenced className

E.g:
```xml
<style>.red_rect {fill: red;}</style>
<rect class="red_rect blue_rect" width="100" height="100"/>
```

After optimization will become (.red_rect is shortened to .a, .blue_rect is removed directly):
```xml
<style>.a {fill: red;}</style>
<rect class="a" width="100" height="100"/>
```

### shorten-color

* Default configuration:
```json
{
	"rules": {
		"shorten-color": [true, {
			"rrggbbaa": false
		}]
	}
}
```
* Explanation:
	* Keep color definitions as short as possible
* Configuration parameters:
	* rrggbbaa
		* Default: false
		* Whether to use 8-digit hexadecimal color (E.g: rgba(255,0,0,0.5) => #ff000080)

E.g:
```xml
<rect fill="#ff0000" stroke="rgb(255,255,255)" color="rgba(0,0,0,0)" width="100" height="100"/>
```

After optimization will become:
```xml
<rect fill="red" stroke="#fff" color="transparent" width="100" height="100"/>
```

### shorten-decimal-digits

* Default configuration:
```json
{
	"rules": {
		"shorten-decimal-digits": true
	}
}
```
* Explanation:
	* Narrowing different types of numerical precision

E.g:
```xml
<rect fill="red" width="100.00001" height="100.00001" fill-opacity="0.05999"/>
```

After optimization will become:
```xml
<rect fill="red" width="100" height="100" fill-opacity="6%"/>
```

### shorten-defs

* Default configuration:
```json
{
	"rules": {
		"shorten-defs": true
	}
}
```
* Explanation:
	* Merge all defs tags
	* Remove invalid defs definitions
	* Remove empty defs tags

E.g:
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

After optimization will become:
```xml
<defs>
	<circle id="path-1" fill="#000" cx="60" cy="60" r="60"></circle>
</defs>
<mask id="mask-2" fill="white">
	<use xlink:href="#path-1" />
</mask>
```
### shorten-filter

* default allocation:
```json
{
	"rules": {
		"shorten-filter": true
	}
}
```
* Explanation:
	* Optimized [Filter Elements] (https://drafts.fxtf.org/filter-effects/#FilterElement)
	* Remove empty filter elements
	* The width and height of the filter element cannot be 0 or negative
	* Duplicate transferFunctionElement is not allowed under feComponentTransfer
	* transferFunctionElement retains only necessary attributes based on type

E.g:
```xml
<filter></filter>
<filter>
	<feComponentTransfer>
		<feFuncR type="gamma" amplitude="1" exponent="1" offset="0"/>
		<feFuncR type="linear" amplitude="1" exponent="1" offset="0" slope="2"/>
	</feComponentTransfer>
</filter>
```

After optimization will becomes:
```xml
<filter>
	<feComponentTransfer>
		<feFuncR type="linear" slope="2"/>
	</feComponentTransfer>
</filter>
```

### shorten-id

* Default configuration:
```json
{
	"rules": {
		"shorten-id": true
	}
}
```
* Explanation:
	* Shorten ID
	* Remove unreferenced IDs

E.g:
```xml
<defs>
	<circle id="circle-1" fill="#000" cx="60" cy="60" r="60"></circle>
</defs>
<mask id="mask-2" fill="white">
	<use xlink:href="#circle-1" />
</mask>
<rect id="rect-3" fill="red" width="100" height="100" mask="url(#mask-2)"/>
```

After optimization will become (#rect-3 is removed and the other 2 ids are shortened):
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

* Default configuration:
```json
{
	"rules": {
		"shorten-shape": true
	}
}
```
* Explanation:
	* If the result of the shape mapping to path is shorter, use path
	* If the rx and ry of the ellipse shape are the same, convert to circle
* Configuration parameters:
	* thinning
		* Default value: 0
		* Limited to 0 or positive integer
		* Thinning polygons and polylines for shorter results
		* 0 means do not perform thinning nodes, non-zero will be regarded as the threshold of thinning nodes

E.g:
```xml
<rect fill="red" width="100" height="100"/>
```

After optimization will become:
```xml
<path fill="red" d="M0,0H100V100H0z"/>
```

### shorten-style-attr

* Default configuration:
```json
{
	"rules": {
		"shorten-style-attr": true
	}
}
```
* Explanation:
	* Shorten style attribute
	* In-depth analysis of the style attribute inheritance chain, removing attributes without applicable objects
	* If there is no style tag, the style and attributes are converted according to the situation

E.g:
```xml
<rect fill="red" style="fill:blue;background:red;"/>
```

After optimization will become (the fill attribute will be overwritten by the definition of the same name in the style, so it is removed, and the background is not a standard svg style, so it is removed):
```xml
<rect style="fill:blue;"/>
```

If there is no style tag in svg, or exchange is set to true, the optimization result is:
```xml
<rect fill="blue"/>
```

### shorten-style-tag

* Default configuration:
```json
{
	"rules": {
		"shorten-style-tag": [true, {
			"deepShorten": true
		}]
	}
}
```
* Explanation:
	* Shorten the content of the style tag
	* Remove duplicate definitions
	* Remove styles that are not in [SVG Specification](https://www.w3.org/TR/SVG/propidx.html)
* Configuration parameters:
	* deepShorten
		* Default: true
		* Remove invalid selector
		* Merge multiple same selectors
		* Merge multiple same rules
