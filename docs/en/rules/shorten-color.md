# shorten-color

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
