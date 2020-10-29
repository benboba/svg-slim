# combine-path

* Default configuration:
```json
{
	"rules": {
		"combine-path": [true, {
			"disregardFill": false,
			"disregardOpacity": false
		}]
	}
}
```
* Explanation:
	* Merge path nodes that meet the following conditions:
		1. All attributes and styles (including inherited styles) are the same
		2. adjacent
		3. no fill
		4. stroke transparency is not less than 1
		5. No marker-start, marker-mid, marker-end
* Configuration parameters:
	* disregardFill
		* Default: false
		* Whether to allow paths that meet the following conditions:
			1. stroke is empty
			2. fill-rull is not evenodd
			3. The transparency of fill is not less than 1
	* disregardOpacity
		* Default: false
		* Whether to allow paths with transparency less than 1
E.g:
```xml
<path d="M0,0L100,100" fill="none" stroke="red" stroke-width="2"/>
<path d="M0,50L100,150" fill="none" stroke="red" stroke-width="2"/>
```

After optimization will become:
```xml
<path d="M0,0L100,100M0,50L100,150" fill="none" stroke="red" stroke-width="2"/>
```
