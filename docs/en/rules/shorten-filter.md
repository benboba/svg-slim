# shorten-filter

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
