# rm-px

* Default configuration:
```json
{
	"rules": {
		"rm-px": true
	}
}
```
* Explanation:
	* Remove px units and 0 units
	* Special case: When font-size, letter-spacing, word-spacing are located in the style attribute or style tag, the px unit will not be removed

E.g:
```xml
<rect fill="red" width="100px" height="100px" rx="0pt"/>
```

After optimization will become:
```xml
<rect fill="red" width="100" height="100" rx="0"/>
```
