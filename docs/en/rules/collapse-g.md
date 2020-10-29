# collapse-g

* Default configuration:
```json
{
	"rules": {
		"collapse-g": true
	}
}
```
* Explanation:
	* When the g element has no children, remove the element
	* When the g element has no attribute value, replace the element with a child element
	* When the g element has only one child element and has no id, class, and mask attributes, copy the attributes of the g element to the child element and replace it with the child element

E.g:
```xml
<g></g>
<g fill="red"><rect width="100" height="100"/></g>
```

After optimization will become:
```xml
<rect fill="red" width="100" height="100"/>
```
