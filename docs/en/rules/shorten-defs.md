# shorten-defs

* Default configuration:
```json
{
	"rules": {
		"shorten-defs": true
	}
}
```
* Explanation:
	* Merge all defs tags
	* Remove invalid defs definitions
	* Remove empty defs tags

E.g:
```xml
<defs>
	<circle id="circle-1" fill="#000" cx="60" cy="60" r="60"></circle>
</defs>
<defs>
	<circle fill-opacity="0.599999964" fill="#000000" cx="60" cy="60" r="60"></circle>
</defs>
<mask id="mask-2" fill="white">
	<use xlink:href="#circle-1" />
</mask>
```

After optimization will become:
```xml
<defs>
	<circle id="path-1" fill="#000" cx="60" cy="60" r="60"></circle>
</defs>
<mask id="mask-2" fill="white">
	<use xlink:href="#path-1" />
</mask>
```
