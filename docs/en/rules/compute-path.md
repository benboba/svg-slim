# compute-path

* Default configuration:
```json
{
	"rules": {
		"compute-path": true
	}
}
```
* Explanation:
	* Calculate the d attribute of path to make it shorter

E.g:
```xml
<path fill="red" d="M0,0L100,0,100,100,0,100z"/>
```

After optimization will become:
```xml
<path fill="red" d="m0,0h100v100H0z"/>
```
