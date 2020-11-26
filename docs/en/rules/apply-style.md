# apply-style

* Default configuration:
```json
{
	"rules": {
		"apply-style": true
	}
}
```

* Explanation:
	* When a rule in the style tag hits only one target element, remove the rule and copy all styles to the style attribute of the target element

E.g:
```xml
<style>
rect {
    fill: red;
}
</style>
<rect width="100" height="100"/>
```

After optimization will become:
```xml
<rect width="100" height="100" style="fill:red"/>
```
