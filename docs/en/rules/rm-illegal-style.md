# rm-illegal-style

* Default configuration:
```json
{
	"rules": {
		"rm-illegal-style": true
	}
}
```
* Explanation:
	* The removal is neither in [standard properties](https://www.w3.org/TR/SVG/propidx.html) nor in [known-css-properties](https://github.com/known-css /known-css-properties#readme) styles in the list
	* If it is [standard property](https://www.w3.org/TR/SVG/propidx.html), the validity of the value will be verified, and the illegal value will be removed
	* Remove duplicate style attribute
	* Remove common attributes covered by style
	* If rmAttrEqDefault is enabled in [params](../config.md#params), the attributes that are equivalent to the default value (for example, black, #000, rgb(0,0,0) are all equivalent) will be removed
	* Remove styles that have no applicable objects on the inheritance chain (such as font-size, font-weight and other styles, which can only be applied to text nodes)

E.g:
```xml
<rect fill="red" style="fill:blue;background:red;unknown:unknown;stroke:none"/>
```

After optimization will become:
```xml
<rect style="fill:blue;background:red;"/>
```
- The fill attribute is overwritten by the definition of the same name in style and removed
- The background exists in known-css-properties and is preserved
- unknown is not a valid css style, removed
- The stroke value none is the same as the default value and is removed
