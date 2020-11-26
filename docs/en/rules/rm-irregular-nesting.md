# rm-irregular-nesting

* Default configuration:
```json
{
	"rules": {
		"rm-irregular-nesting": [true, {
			"ignore": []
		}]
	}
}
```
* Explanation:
	* Remove irregularly nested tags
* Configuration parameters:
	* ignore
		* Default:\[]
		* Restricted to a list of strings. If the tag name of an element is in the list, neither the element nor its child elements will validate the nesting rules.

E.g:
```xml
<rect fill="red" width="100px" height="100px"><circle cx="100" cy="100" r="100"/></rect>
```

After optimization will become:
```xml
<rect fill="red" width="100" height="100"/>
```
