# rm-xmlns

* Default configuration:
```json
{
	"rules": {
		"rm-xmlns": true
	}
}
```
* Explanation:
	* Remove unreferenced xmlns definitions, remove attributes containing undefined namespaces

E.g:
```xml
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	<rect fill="red" width="100" height="100"/>
</svg>
```

After optimization will become(Since the xlink namespace is not referenced, it was removed):
```xml
<svg xmlns="http://www.w3.org/2000/svg">
	<rect fill="red" width="100" height="100"/>
</svg>
```
