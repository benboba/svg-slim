# rm-attribute

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
