# shorten-animate

* Default configuration:
```json
{
	"rules": {
		"shorten-animate": [true, {
			"remove": false
		}]
	}
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
