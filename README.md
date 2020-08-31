# svg-slimming

[![npm version](https://badge.fury.io/js/svg-slimming.svg)](https://badge.fury.io/js/svg-slimming)

## Change Log

[View change log](./CHANGELOG.md)

## Introduction

svg-slimming is an SVG compression tool that provides rich customization and follows the [W3C SVG specification](https://www.w3.org/TR/SVG/)

## Installation
```
npm install svg-slimming
```

## Use
```js
const svgSlimming = require('svg-slimming');
svgSlimming(svgcode[, config]).then(result => {
	console.log(result);
});
```

Where svgcode is svg text in string format and config is user-defined optimized configuration

### Use svg-slimming-loader

[svg-slimming-loader](https://github.com/benboba/svg-slimming-loader) is a loader plugin for webpack, which supports optimization of imported SVG files

### Use postcss-svg-slimming

[postcss-svg-slimming](https://github.com/benboba/postcss-svg-slimming) is a plugin for postcss that supports optimizing inline SVG in CSS

## Why choose svg-slimming?

* Rich and powerful functions, enough personalized configuration parameters
* Pursue the ultimate optimization effect
* Try not to destroy the original svg effect
* Follow the latest svg specifications

### vs svgo

| Optimization classification | Optimization project | svg-slimming | svgo |
| ---- | ---- | ---- | ---- |
| Basic | svg parsing | Built-in parser xml-parser | sax |
| Basic | Non-svg xml node processing logic | Remove | Report error |
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
| css | attribute to style | √ (badcase exists) | × |
| css | remove css styles not supported by svg | √ (badcase exists) | × |
| css | Apply style content directly to elements | × | √ |

## Optimized Configuration

The optimized configuration is an object in JSON format, where key is the corresponding configuration item, value is the array, the first item in the array is the switch of the rule, and the second item (if any) is the detailed configuration of the rule.

The following is an example of an optimized configuration:
```json
{
	"collapse-g": [false],
	"combine-transform": [true, {
		"trifuncDigit": 3,
		"sizeDigit": 2,
		"angelDigit": 2
	}]
}
```

** Note: Although the old configuration method can also take effect, it may be removed in the future **
```json
{
	"collapse-g": false,
	"combine-transform": [true, 3, 2, 2]
}
```

### collapse-g

* Default configuration:
```json
{
	"collapse-g": [true]
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
	"collapse-textwrap": [true]
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
	"combine-path": [true, {
		"disregardFill": false,
		"disregardOpacity": false
	}]
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
	"combine-transform": [true, {
		"angelDigit": 2,
		"sizeDigit": 2,
		"trifuncDigit": 3
	}]
}
```
* Explanation:
	* Analyze and merge transform attributes
* Configuration parameters:
	* angelDigit
		* Default value: 2
		* Limited to 0 or positive integer
		* Angle parameter accuracy of skewX, skewY, rotate
	* sizeDigit
		* Default value: 2
		* Limited to 0 or positive integer
		* matrix e, f position parameter precision, translate parameter precision, and 3 parameter precision after 2 value rotate
	* trifuncDigit
		* Default: 3
		* Limited to 0 or positive integer
		* matrix a, b, c, d position parameter precision, scale parameter precision

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
	"compute-path": [true, {
		"angelDigit": 2,
		"sizeDigit": 2,
		"straighten": 0,
		"thinning": 0
	}]
}
```
* Explanation:
	* Calculate the d attribute of path to make it shorter
* Configuration parameters:
	* angelDigit
		* Default value: 2
		* Limited to 0 or positive integer
		* Accuracy of a / A instruction x-axis-rotation
	* sizeDigit
		* Default value: 2
		* Limited to 0 or positive integer
		* Precision of coordinate type values
	* straighten
		* Default value: 0
		* Limited to 0 or positive integer
		* Turn the curve command within the specified threshold into a shorter straight command
		* If it is 0, it means that no conversion will be performed.
	* thinning
		* Default value: 0
		* Limited to 0 or positive integer
		* Thin out path nodes for shorter results
		* 0 means no path thinning is performed, non-zero will be considered as the threshold of thinning nodes

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
	"rm-attribute": [true, {
		"keepAria": false,
		"keepEvent": false,
		"rmDefault": true
	}]
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
	* rmDefault
		* Default: true
		* Remove the same attribute as the default (if the attribute is inheritable and the parent element has an attribute with the same name, it cannot be removed)

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
	"rm-comments": [true]
}
```
* Explanation:
	* Remove comment

### rm-doctype

* Default configuration:
```json
{
	"rm-doctype": [true]
}
```
* Explanation:
	* Remove DOCTYPE declaration

### rm-hidden

* Default configuration:
```json
{
	"rm-hidden": [true]
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
	"rm-irregular-nesting": [true, {
		"ignore": []
	}]
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
	"rm-irregular-tag": [true, {
		"ignore": []
	}]
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
	"rm-px": [true]
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
	"rm-unnecessary": [true, {
		"tags": ["desc", "discard", "foreignObject", "video", "audio", "iframe", "canvas", "metadata", "script", "title", "unknown", "image"]
	}]
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
	"rm-version": [true]
}
```
* Explanation:
	* Remove version attribute from svg element

### rm-viewbox

* Default configuration:
```json
{
	"rm-viewbox": [true]
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
	"rm-xml-decl": [true]
}
```
* Explanation:
	* Remove xml declaration

### rm-xmlns

* Default configuration:
```json
{
	"rm-xmlns": [true]
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
	"shorten-animate": [true, {
		"remove": false
	}]
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
	"shorten-class": [true]
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
	"shorten-color": [true, {
		"opacityDigit": 3,
		"rrggbbaa": false
	}]
}
```
* Explanation:
	* Keep color definitions as short as possible
* Configuration parameters:
	* opacityDigit
		* Default: 3
		* Limited to 0 or positive integer
		* Precision of color alpha values in rgba, hsla format
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
	"shorten-decimal-digits": [true, {
		"angelDigit": 2,
		"sizeDigit": 2
	}]
}
```
* Explanation:
	* Narrowing different types of numerical precision
* Configuration parameters:
	* angelDigit
		* Default value: 2
		* Limited to 0 or positive integer
		* Accuracy of numerical values such as transparency, angle, and radian
	* sizeDigit
		* Default value: 2
		* Limited to 0 or positive integer
		* Accuracy of coordinate and size type values

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
	"shorten-defs": [true]
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
"shorten-filter": [true]
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
	"shorten-id": [true]
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
	"shorten-shape": [true, {
		"thinning": 0
	}]
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
	"shorten-style-attr": [true, {
		"exchange": false,
		"rmDefault": true
	}]
}
```
* Explanation:
	* Shorten style attribute
	* In-depth analysis of the style attribute inheritance chain, removing attributes without applicable objects
	* If there is no style tag, the style and attributes are converted according to the situation
* Configuration parameters:
	* exchange
		* Default: false
		* Regardless of the existence of the style tag, enforce the mutual conversion of style and attributes
		* **Note: svg's style override rules are style attributes > style tags > attributes, so coercion may cause incorrect overrides**
	* rmDefault
		* Default: true
		* Remove the same property as the default (only the style property is involved)
		* Some attributes may have different default values for different elements, this rule only verifies a single default value

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
	"shorten-style-tag": [true, {
		"deepShorten": true,
		"rmDefault": true
	}]
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
	* rmDefault
		* Default: true
		* Remove the same property as the default (only the style property is involved)
		* Some attributes may have different default values for different elements, this rule only verifies a single default value

## Other optimization work

Listed below are the optimizations that this tool actively performs

* Remove white space between labels
* Remove nodes of type OtherSect and OtherDecl (see NodeType description below the documentation)
* Self-closing labels without content
* Merge all style tags
* Merge all script tags
* Merge adjacent text type nodes or CDATA nodes
* Merge all redundant whitespace characters
* Remove text child nodes from nodes without text content
* If "<" is not included in the CDATA node, it will be converted into a normal text node

# xml-parser

## Introduction

An XML parsing tool is included in the project and can be used directly after installing the project without additional installation.

## Use
```js
const xmlParser = require('svg-slimming/xml-parser.js');

xmlParser.parse(xmlcode).then(result => {
	console.log(result);
});

console.log(xmlParser.NodeType);
```

Where xmlcode is xml text in string format (not limited to svg)

## NodeType

Node types follow the definition of the DOM specification as much as possible [Reference Document](https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType)

The specific definitions are as follows:

* Element Node | Tag
	* value: 1
	* nodeName: \<tagName>
	* Contains attributes and childNodes


* Text Node | Text
	* value: 3
	* nodeName: #text
	* Contains the textContent property


* CDATA
	* value: 4
	* nodeName: #cdata
	* Contains the textContent property


* OtherSect
	* value: 5
	* nodeName: #\<sectName>
	* Contains the textContent property
	* Refers to blocks other than CDATA, such as <!\[INCLUDE \[...\]\]>


* OtherDecl
	* value: 6
	* nodeName: #\<declName>
	* Contains the textContent property
	* Refers to declarations other than DocType, such as <!ENTITY...>


* xml declaration | XMLDecl
	* value: 7
	* nodeName: #xml-decl
	* Contains the textContent property


* Notes | Comments
	* value: 8
	* nodeName: #comments
	* Contains the textContent property


* document node | Document
	* value: 9
	* nodeName: #document
	* Contains childNodes attribute
	* The root node object output by xml-parser


* DocType
	* value: 10
	* nodeName: #doctype
	* Contains the textContent property


## Node definition (typescript format)
```ts
interface INode {
	nodeName: string;
	nodeType: NodeType;
	namespace?: string;
	textContent?: string;

	readonly attributes?: IAttr[];
	readonly childNodes?: INode[];

	parentNode?: INode;

	cloneNode(): INode;

	appendChild(childNode: INode): void;
	insertBefore(childNode: INode, previousTarget: INode): void;
	replaceChild(childNode: INode, ...children: INode[]): void;
	removeChild(childNode: INode): void;

	hasAttribute(name: string, namespace?: string): boolean;
	getAttribute(name: string, namespace?: string): string;
	setAttribute(name: string, value: string, namespace?: string): void;
	removeAttribute(name: string, namespace?: string): void;
}
```

## Attribute definition (typescript format)
```ts
interface IAttr {
	name: string; // Attribute name (without namespace)
	value: string;
	fullname: string; // Attribute full name (including namespace)
	namespace?: string;
}
```

## What are the advantages of this xml parser?

* Strictly follow the xml specification, it will report an error when it encounters non-compliant xml text, instead of trying to repair
* Supports parsing xml declaration, doctype, comment, CDATA and other types of nodes
* XML namespaces will be parsed correctly
* Attributes of element nodes are correctly parsed, including attributes with namespaces
* Strictly reflects the content order and format of the original document, and does not do additional things such as text node merge
