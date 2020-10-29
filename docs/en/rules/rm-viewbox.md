# rm-viewbox

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
