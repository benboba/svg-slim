# combine-transform

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
