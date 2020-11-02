# shorten-id

* Default configuration:
```json
{
	"rules": {
		"shorten-id": true
	}
}
```
* Explanation:
	* Shorten ID
	* Remove unreferenced IDs

E.g:
```xml
<defs>
	<circle id="circle-1" fill="#000" cx="60" cy="60" r="60"></circle>
</defs>
<mask id="mask-2" fill="white">
	<use xlink:href="#circle-1" />
</mask>
<rect id="rect-3" fill="red" width="100" height="100" mask="url(#mask-2)"/>
```

After optimization will become (#rect-3 is removed and the other 2 ids are shortened):
```xml
<defs>
	<circle id="a" fill="#000" cx="60" cy="60" r="60"></circle>
</defs>
<mask id="b" fill="white">
	<use xlink:href="#a" />
</mask>
<rect fill="red" width="100" height="100" mask="url(#b)"/>
```
