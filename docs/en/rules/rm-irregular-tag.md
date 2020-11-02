# rm-irregular-tag

* Default configuration:
```json
{
	"rules": {
		"rm-irregular-tag": [true, {
			"ignore": []
		}]
	}
}
```
* Explanation:
	* Remove tags that are not in [SVG Specification](https://www.w3.org/TR/SVG/eltindex.html)
* Configuration parameters:
	* ignore
		* Default:\[]
		* Restricted to a list of strings. If the tag name of an element is in the list, the element will not be removed although it is not a standard SVG tag
