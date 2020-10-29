# style-to-class

* Default configuration:
```json
{
	"rules": {
		"style-to-class": [true]
	}
}
```
* Explanation:
	* If multiple tags have exactly the same style attributes, these attributes will be removed and a class will be created in the \<style> tag
	* If the \<style> tag does not exist, it will actively create one and insert it at the front of the \<svg> tag
	* The same style attribute cannot be less than 3, and the number of tags multiplied by the number of style attributes cannot be less than 10, for example:
		 * No less than 4 tags have the same style attribute, and the number of style attributes is no less than 3
		 * No less than 3 tags have the same style attribute, and the number of style attributes is no less than 4
		 * No less than 2 tags have the same style attribute, and the number of style attributes is no less than 5

E.g:
```xml
<text style="fill:blue;font-size:12px;font-weight:400;">1</text>
<text style="fill:blue;font-size:12px;font-weight:400;">2</text>
<text style="fill:blue;font-size:12px;font-weight:400;">3</text>
<text style="fill:blue;font-size:12px;font-weight:400;">4</text>
```

After optimization will become:
```xml
<style>.newClassName{fill:blue;font-size:12px;font-weight:400}</style>
<text class="newClassName">1</text>
<text class="newClassName">2</text>
<text class="newClassName">3</text>
<text class="newClassName">4</text>
```
