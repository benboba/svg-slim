# rm-hidden

* Default configuration:
```json
{
	"rules": {
		"rm-hidden": true
	}
}
```
* Explanation:
	* Remove elements with display attribute none
	* Removed graphic elements with fill and stroke properties of none
	* Remove text container without children
	* Remove textPath elements that have neither the path attribute nor the href and xlink:href attributes
	* Remove other graphic elements that are not rendered for some reason

The following will be removed:

display IS none
```xml
<g style="display:none"></g>
```

stroke and fill are none
```xml
<rect fill="none" stroke="none" width="100" height="100"/>
```

use element references a non-existing id
```xml
<use href="#undefined"/>
```

Some elements that are not visible because the size attribute is 0, e.g:
```xml
<pattern id="pattern-1" width="0" height="0" />
```
