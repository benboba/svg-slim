# rm-unnecessary

* Default configuration:
```json
{
	"rules": {
		"rm-unnecessary": [true, {
			"tags": ["desc", "discard", "foreignObject", "video", "audio", "iframe", "canvas", "metadata", "script", "title", "unknown", "image"]
		}]
	}
}
```
* Explanation:
	* Remove unnecessary tags
	* **Although style tags are not removed by default, some rules (such as shape-to-path) may cause selectors in the style sheet to fail to match**
	* **As there is no analysis and processing of javascript scripts, if the script tag is not removed by default, there is no guarantee that the optimized code can still be executed correctly**
* Configuration parameters:
	* tags
		* Default: ["desc", "discard", "foreignObject", "video", "audio", "iframe", "canvas", "metadata", "script", "title", "unknown", "image"]
		* Restricted to a list of strings
		* Configure the tag names to be removed. Only tags in the following list can be removed: ["desc", "discard", "foreignObject", "video", "audio", "iframe", "canvas", "metadata", "script", "style", "title", "unknown", "image"]
