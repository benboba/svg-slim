# Change Log

## 2020.01.22 v1.5.1

### Comprehensive

* Renamed UPDATE* .md to CHANGELOG* .md

### xml-parser

* Optimized the implementation of xml-parser to improve the efficiency of parsing large files
* xml-parser error message changed to English

### svg-slimming

* Optimize data structure to reduce packing capacity
* The x, y, dx, dy, and rotate attributes of text and tspan now support length-percentage list form
* Added logic for [alpha-value](https://www.w3.org/TR/css-color/#typedef-alpha-value) which compares the percentage format and numeric format which is shorter
* The compute-path rule now takes effect on the path property of animateMotion
* Added the judgment of whether style attributes are inheritable when parsing the style tree (all styles were considered to be inheritable before, there are badcases)
* Introduced [css-validator](https://www.npmjs.com/package/css-validator) for css class-style legality verification, removed some logic in the code regarding css legality verification
* Updated regular-attr list, added some css attributes supported by svg, removed some obsolete attributes in svg specification
* Added a configuration item rmDefault for shorten-style-tag and shorten-style-attr, which supports removing the css attribute with the same default value
* Fixed a bug where all rules are not applicable to the current tag when validating the validity of attributes
* rm-unnecessary rule removes image elements by default
* Improved the implementation of attribute and style conversion in shorten-style-attr
* Added logic to traverse nodes asynchronously

## 2020.01.08 v1.5.0 **breaking change**

### svg-slimming

* Added README.md and UPDATE.md in English
* Added dependencies svg-path-contours and triangulate-contours
* [**breaking change**]Now all config configuration items support object form, see details [README](https://github.com/benboba/svg-slimming/blob/master/README.md)
* Fixed hsl and hsla colors being accidentally removed by rm-attribute rules when using units in hue
* shorten-color uses the original data when the operation result is worse than the original data (for example, hsl(9,9%,9%,.5) => rgb(25,22,21,.5))
* shorten-color now verifies which representations of hsl and rgb are shorter and takes a shorter representation
* shorten-color added logic to output "rgb(0,0,0,0)" as "transparent"
* shorten-color will convert rgba(r,g,b,.01) to rgb(r,g,b,1%) for better compression effect
* Optimized the implementation of shorten-defs
* [**breaking change**] Merge shape-to-path and douglas-peucker rules into shorten-shape rules and fix some badcases
* Added the logic of ellipse and circle to the shorten-shape rule
* [**breaking change**] Adjust shape-related logic in rm-hidden to shorten-shape and fix some badcases
* Optimized rm-hidden implementation and added more optimizable cases
* Fixed a case where the geometry class attribute was not marked couldBeStyle and caused a badcase when the attribute and style were converted
* Now rm-attribute will verify the coexistence of href and xlink: href. If it exists, it will remove the xlink: href attribute according to [rules](https://svgwg.org/svg2-draft/linking.html#XLinkRefAttrs)
* rm-px will now more accurately remove px units for numeric attributes, non-numeric attributes will be ignored (previously there was a badcase that would optimize id="t:1px" to id="t:1")
* rm-px will now remove all units after 0 value
* Fixed a bug where there was no comma after the a command flag in path
* The comma after the flag position of a directive is now removed when the path is optimized
* Rewritten the method of path parsing and stringification, and changed the data format to a two-dimensional array with subpath as the unit
* Modified compute-path between absolute and relative coordinates. Considering most optimizable cases, relative coordinates are now preferred.
* Now compute-path will omit m+l or M+L instruction names for better results in the final output
* compute-path modified the rule of automatically removing path segments of length 0 to: without stroke, remove subpaths with an area of 0
* Added a configuration item to compute-path, which will convert curve instructions less than the specified threshold to linear instructions
* [**breaking change**] The configuration item of compute-path thinning node switch no longer takes effect. As long as the thinning node threshold is greater than 0, thinning is performed
* compute-path adds judgment logic that can also convert q/c instructions to t/s instructions when the preceding instruction is not q/t/c/s, and optimizes the simplified judgment logic
* Shorten-shape, compute-path, and combine-path now consider the presence of marker references
* Fixed a bug where transform was accidentally removed because 3 value rotate is not supported
* Improved the implementation logic of matrix and added support for 3 value rotate function
* Now when optimizing values, when using multiples of 100, scientific notation is preferred
* Added some valid css3 attributes to avoid being removed by mistake
* Optimized the parsing rules of the style attribute, taking into account the case of comments and quotes, and processing the parsing results, removing some comments and redundant blanks
* The width and height properties of the root element will not be converted to style now, to avoid causing some style problems in css
* Now shorten-defs will no longer track and remove references to ids, and the corresponding processing is only done in the shorten-id rules
* For the above improvements, add test cases

## 2019.09.26 v1.4.3

### svg-slimming

* Fixed the bug that shorten-color optimizes the rgba color when the alpha value is less than 1
* Fixed rm-attribute accidentally removing rgb(r,g,b,a), rgba(r,g,b), hsl(h,s,l,a), hsla(h,s,l) formats Problems with color attributes

## 2019.09.23 v1.4.2

### svg-slimming

* Fixed compute-path's wrong practice of keeping only the last group for consecutive M/m instructions. The correct way is to treat subsequent M/m instructions as L/l

## 2019.09.18 v1.4.1

### Comprehensive

* Upgrade tslint to 5.19.0 and update some rules

### svg-slimming

* **Adjusted the numerical precision configuration of the default rules. The default numerical size class values will now retain 2 digits after the decimal point (involving rules: combine-transform, compute-path, shorten-decimal-digits)**
* The combine-path rule now restricts the fill-rule attribute from not being evenodd, avoiding accidental hollowing out due to merging without path crossing judgment
* Fixed a bug where the compute-path rule would report an error when there were only M instructions
* The compute-path rule now directly removes the path node when it cannot resolve the d attribute or only the M instruction
* Corrected the timing of parsing style tags, now style parsing and stringification will not be repeated multiple times in one optimization
* Curried the matchSelector utility function to ensure a more functional call

## 2019.08.27 v1.4.0

### Comprehensive

* Introduced nyc for unit test coverage check
* Introduced ts-node to perform unit tests on the ts module
* Added a large number of unit tests and targeted bug fixes (see below)

### xml-parser

* Fixed missing detection of Doctype regular expressions that do not match quotes
* Fixed the bug that xml-parser.d.ts exported member name is incorrect

### svg-slimming

* Fixed svg-slimming.d.ts to correspond to xml-parser.d.ts
* Fixed the problem that when passing config merge, the array type is not verified, which may cause an unexpected error in the passed in object or function
* Now all places that rely on the css module for parsing have added try ... catch, in order to deal with the problem that the css module reports an error that affects the optimization result due to illegal strings
* Instead of using toFixed to process values, use Math.round+Math.abs instead to solve the problem of 1.15.toFixed (1) = 1.1
* Improved Douglas Puke algorithm, increase judgment of boundary conditions
* Improved hexadecimal color parsing, added 1% to 100% lookup table, and fixed #00000080 cannot be correctly parsed as rgba(0,0,0,0.5)
* Fixed the bug that the regular expression is not reset when parsing rgb | hsl | rgba | hsla colors continuously
* Fixed the problem of inconsistent color parsing logic and W3C rules. Now rgb and hsl will handle the alpha value, rgba and hsla will correctly handle the case where there is no alpha value, hsl will handle the case where the value of hue is in units
* Adjusted the shorten-color parameter that limits the number of alpha values.
* Fixed a bug in regular expression of attribute selector
* combine-script will now move the combined script tag to the end of the svg element and remove the trailing semicolon
* Fixed the wrong calculation method of directly adding angles when the skewX and skewY functions are merged, and changed to the real matrix multiplication operation
* Corrected the parsing rules of matrix. Now when encountering the wrong matrix format, it will jump out directly without continuing parsing. Will now match the entire matrix string with the whole word, avoiding the problem that the string is still parsed incorrectly
* Fixed the problem that the simple function is not optimized again when the matrix is ​​converted into a simple function
* Fixed an issue where -0 was not correctly converted to 0 during matrix optimization
* Path will now be parsed more strictly, the d attribute will be truncated when encountering a problematic format, and the behavior is consistent with the browser
* Ellipse and a command with rotation angle in path will now merge correctly
* L instructions in the same direction in path will now be merged correctly, and the h and v instructions in the opposite direction will be merged
* Fixed the issue that the reserved aria and reserved eventHandler options in the rm-attribute rule are invalid
* rm-attribute will now verify that the values ​​of all style class attributes match the css global keywords initial, inherit, unset
* rm-attribute now analyzes the style inheritance chain. Although the value of the current style is the default value, if a style with the same name exists on the parent element, the current style will not be removed.
* rm-attribute When judging whether the value of an attribute is the default value, in addition to whole word matching, it will also try to parse the number or color type for deep comparison
* Fixed the issue that rm-hidden rules do not have deep parsing style, which may cause deletion or non-deletion
* The rm-hidden rule will not directly remove graphic elements without padding and strokes, and will also determine whether there is an id for itself or an ancestor element. Only those that do not exist will be removed
* rm-irregular-nesting will now no longer process child elements after the parent element hits the ignore rule
* Fixed the issue that some numberlist attributes were not parsed according to numberlist, which caused some parse errors
* The rm-viewbox rule now verifies that the length of the viewBox property after parsing is 4 and the width and height cannot be negative. In addition, it will correctly verify the unit. Only properties with a unit of px may trigger rm-viewbox
* The shorten-style-tag rule now removes comment and empty keyframes, mediaquery, font-face, and other css nodes
* Fixed the problem that when parsing CSS selectors, when encountering a combination of attributes, class, id, and pseudo-class selectors, only the last case of the composition would be erroneously parsed
* Fixed an issue where sibling selectors would lose some matches in getting elements based on selectors

## 2019.03.29 v1.3.4

### svg-slimming

* Improved the judgment logic of the animation attribute reference in the rm-attribute rule, and fixed the bug of accidentally deleting the value attribute of feColorMatrix

## 2019.03.14 v1.3.3

### Comprehensive

* Adopted stricter tslint specification and unified code format

### svg-slimming

* The optimization result of shorten-style-tag has been further improved. Now the validity of each css rule will be verified, and invalid css rules will be removed.

E.g:
```xml
	<svg><style>#redText{fill:yellow;marker-end:none}</style><text id="redText">123</text></svg>
```

Now optimized to:
```xml
	<svg><style>#redText{fill:yellow}</style><text id="redText">123</text></svg>
```

## 2019.03.13 v1.3.2

### svg-slimming

* Solved a badcase of style / check-apply hit penetration

E.g:
```xml
	<svg><g id="a" fill="red"><rect fill="white"/><g fill="blue"><rect/></g></g></svg>
```

The old optimization results were:
```xml
	<svg><g id="a" fill="red"><rect fill="white"/><rect fill="blue"/></g></svg>
```

Now optimized to:
```xml
	<svg><g id="a"><rect fill="white"/><rect fill="blue"/></g></svg>
```

## 2019.03.12 v1.3.1

### Comprehensive

* Upgrade lodash to 4.17.11 to fix potential security holes
* Split update log from README.md

### svg-slimming

* Added style/check-apply dependency to shorten-style-tag rules
* The style/check-apply module has been improved, and will now validate the final valid applicable elements of the style. When no valid applicable elements exist on the style inheritance chain, the style will be removed
* Fixed a misjudgment bug of style/check-apply

## 2019.01.11 v1.3.0

### svg-slimming

* Upgraded tslint with more stringent specifications
* Enable strict mode in tsconfig
* Added reliance on [he](https://www.npmjs.com/package/he), fixed a bug that caused HTML entities to fail when parsing style attributes
* Adjusted the id attribute validation rules, fixed a bug that caused the id attribute to be removed incorrectly due to id validation
* Added support for rebeccapurple keyword in color legitimacy verification
* Adjusted the collapse-g rule, if the parent element has a style attribute, it cannot be merged, otherwise it may lead to the wrong style overlay
* The combine-path rule has been adjusted so that cases where fill or stroke have less than 1 transparency
* Added 2 configuration parameters for combine-path: 1. Whether to merge paths with stroke attribute of none; 2. Whether to merge regardless of transparency

## 2019.01.03 v1.2.14

### svg-slimming

* The compute-path rule now removes the move instruction (m M) at the end of the path
* Fixed a bug that failed to resolve css pseudo-class pseudo-elements
* Added validation of pseudo-classes and pseudo-elements for the short-style-tag rule. According to [SVG Specification](https://www.w3.org/TR/SVG2/styling.html#RequiredCSSFeatures), only CSS 2.1 specifications are verified Pseudo-classes and partial pseudo-elements

## 2019.01.02 v1.2.13

### svg-slimming

* Fixed a bug where path merge could cause path rendering to shift
* Fixed a bug where multiple consecutive paths could not be merged into one correctly

## 2018.12.29 v1.2.10 ~ v1.2.12

### Comprehensive

* Place the .d.ts declaration file in package.json
* Update typescript to 3.2.2
* tsconfig.json enables stricter options
* Drop uglifyjs-webpack-plugin and use terser-webpack-plugin instead

### svg-slimming

* Adjusted the order of some rules
* Fixed a bug where matrix may lose parameters when parsing compressed code
* Added logic to parse css style tree
* Path merge rule adjustment: 1. All attributes are the same, including the style tree; 2. Adjacent; 3. Fill or stroke on the style tree is none

## 2018.12.23 v1.2.9

### Comprehensive

* In the .d.ts declaration file, modifying the config parameter is optional

### svg-slimming

* Modified the logic of config merge from shallow copy to bitwise comparison
* Optimize the number of digits of the d attribute and remove it from the shorten-decimal-digit rule
* Added two parameters to the compute-path rule to optimize the number of digits in the d attribute
* Fixed a bug where className was not allowed to be reused in shorten-class
* Fixed bug with attribute selector parsing
* Modified the rules of path merging, now (temporarily) only merging paths without fill, class and id are allowed
* Fixed the bug that the optimization results did not meet the expectations due to attribute line wrapping during path and matrix parsing

## 2018.12.21 v1.2.8

### Comprehensive

* Added .d.ts declaration file

## 2018.11.1 v1.2.7

### svg-slimming

* Fixed a bug where rotation and translation coexist when only simplifying rotation when performing matrix simplification
* Fixed the bug that node has xlink: href attribute when deep analysis of style inheritance chain

## 2018.10.11 v1.2.6

### svg-slimming

* Fixed a bug with regular expression character set overflow in syntax.ts
* Optimize the shape-to-path rule. Now when rect is converted to path, the smaller one is selected from hvh and vhv.
* Optimized the combine-transform rule, and added the logic to reverse the matrix into a simple function

## 2018.09.19 v1.2.5

### svg-slimming

* Improved valid value validation rules for all attributes
* Optimize compute-path rules. All path functions now support more bit parameters and elimination rules for the number of illegal parameters.
* Added logic of 1 -1 to 1-1, 0.5 0.5 to .5.5 for cases where commaWsp separated numbers except path
* The logic of rm-attribute rule configuration parameter 1 is changed to remove the same attribute as the default value

## 2018.09.07 v1.2.4

### svg-slimming

* Add valid value validation rules for some attributes
* Fixed the issue that the values property was not considered when judging the animation properties
* Fixed a bug that caused incorrect judgment of valid values of enumerated class attributes
* Fixed the bug that did not consider 9 + 9 or .5.5 when parsing the d attribute of the path element, and added the logic that 0.5 0.5 can be compressed to .5.5
* Added logic for converting the mantissa of an integer to more than 3 digits when the number is optimized
* Added the logic of combining adjacent transform functions to the combine-transform rule to ensure better optimization results
* The combine-transform rule now supports a fourth parameter that defines the accuracy of angle-like data
* The combine-transform rule now performs numerical precision optimization on the original string to ensure better optimization results

## 2018.08.24 v1.2.3

### Comprehensive

* Fixed some formatting issues of README.md
* Complete the definition of typescript to ensure that no-any and no-unsafe-any rules pass

### xml-parser

* Improved some xml structure errors and wrote corresponding test cases
* The line number of the error message is changed from \\n to \\n \\r \\r \\n

### svg-slimming

* The number regular expression adds the i modifier to avoid the case of scientific notation e capital
* Property of the transform class, no longer applying the shorten-decimal-digits rule (because it will be optimized in the combine-transform rule)
* Fixed a bug with css attribute selector regular expressions
* The fillin tool is compatible with cases where the number of characters entered is greater than the specified number of characters
* rm-xmlns rules now support node namespaces
* The combine-path rule adds the restriction that only adjacent path nodes can be combined
* Added attributes to svg-slimming package to point to xmlParser and NodeType, which can be called by
```javascript
	const svgSlimming = require('svg-slimming');
	svgSlimming.xmlParser('svg string').then(result => { console.log(result); });
	console.log(svgSlimming.NodeType);
```

## 2018.08.15 v1.2.2

### Comprehensive

* The default file points to svg-slimming.min.js
* Post to github and add test cases
* Fixed the problem that the position is not reset after the global regular expression exec, which results in incorrect results during multiple consecutive parsing

### xml-parser

* Fixed a bug in parsing otherDecl regular expressions

### svg-slimming

* The separator of numerical values in compute-path output changed from a space " " to a comma ","
* rm-attribute rule, when removing animated attributes that are not achievable, remove the attributeName attribute
* rm-hidden rule, adding the judgment that some shape elements have no specified attributes

## 2018.08.10 v1.2.1

### svg-slimming

* Further refine the deep-optimization rules of shorten-style-tag
* Considering browser compatibility and frequency of property usage, temporarily set the transform property to non-convertible to style
* Added configuration items for rm-irregular-tag and rm-irregular-nesting rules, you can configure tags to ignore this rule

## 2018.08.09 v1.2.0

### svg-slimming

* Fixed a regular expression bug in shorten-class
* Implemented deep-style-tag optimization rules
* Improved label and attribute correspondence and rm-attribute rules
* Synchronized with the latest [W3C specifications](https://www.w3.org/TR/2018/CR-SVG2-20180807/)

## 2018.08.06 v1.1.9

### Comprehensive

* Added svg-slimming.min.js and xml-parser.min.js

### svg-slimming

* Fixed incorrect color of parsing rgb format in shorten-color
* Added optimization hints for some rules in readme.md
* Fixed UglifyJSPlugin causing shape-to-path to fail
* Adjusted the execution order of some rules to get better optimization results

## 2018.08.03 v1.1.8

### svg-slimming

* UglifyJSPlugin is temporarily closed due to the invalid shape-to-path rule

## 2018.08.03 v1.1.7

### svg-slimming

* Use rm-unnecessary rules to replace the original rm-desc, rm-discard, rm-foreign, rm-metadata, rm-title, rm-script, rm-style, rm-unknown rules Rule except html embed element
* Added css style to determine whether there are applicable objects on the inheritance chain, compatible with xlink:href reference

## 2018.08.02 v1.1.6

### Comprehensive

* Enable UglifyJSPlugin compression code
* The NodeType enumeration and INode and IAttr interfaces are promoted to a global configuration, which is jointly dependent on the two projects svg-slimming and xml-parser
* Enriched INode interface functions
	* attributes and childNodes are read-only
	* Increase the parentNode pointer to point to the parent node of the current node
	* Added cloneNode method to return the replicated node of the current node, where attributes will be deeply copied, and neither parentNode nor childNodes will be copied
	* Added appendChild | insertBefore | removeChild | replaceChild method for child node management
	* Added hasAttribute | getAttribute | setAttribute | removeAttribute methods for attribute management

### xml-parser

* When a parsing error occurs, the wrong line number and position will be prompted
* Node changed from interface to class and implements methods defined by INode

### svg-slimming

* Adapted the code to the new INode interface
* Add and improve some ts interfaces and reduce any type
* Added support for skewX and skewY for matrix blending, and added logic to terminate blending if incorrect deformation functions are encountered
* Implemented rm-irregular-nesting rules
* Added rm-unknown and rm-foreign rules
