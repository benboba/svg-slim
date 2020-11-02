# shorten-style-attr

* Default configuration:
```json
{
	"rules": {
		"shorten-style-attr": true
	}
}
```
* Explanation:
	* If the style tag does not exist in the svg, or [params](../config.md#params) has exchangeStyle enabled, the conversion of style and attributes will be performed

The first case (attribute to style):
```xml
<text font-family="Arial" font-size="13.31" font-stretch="Normal" font-weight="400!important" font-style="italic" fill="red">80</text>
```

The optimization result is (note that the font-size will be appended with px units):
```xml
<text style="font-family:Arial;font-size:13.31px;font-stretch:Normal;font-weight:400!important;font-style:italic;fill:red">80</text>
```

The second case (style to attribute):
```xml
<rect style="fill:blue;stroke:red"/>
```

The optimization results is:
```xml
<rect fill="blue" stroke="red"/>
```

The third case (when encountering a style that cannot be converted to attributes, the inversion rule will be attributed to style):
```xml
<rect fill="blue" stroke="red" style="box-sizing:border-box"/>
```

The optimization results is:
```xml
<rect style="box-sizing:border-box;fill:blue;stroke:red"/>
```
