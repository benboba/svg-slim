# shorten-decimal-digits

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
