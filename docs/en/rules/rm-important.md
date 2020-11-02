# rm-important

* Default configuration:
```json
{
	"rules": {
		"rm-important": true
	}
}
```

* Explanation:
	* Remove unnecessary !important in the style sheet
	* The following conditions will be reserved!important
		* The style of the style tag overrides the inline style
		* Low priority selector overrides high priority selector
		* Override styles with !important mark

E.g:
```xml
<style>
rect {
	fill: red!important;
	stroke: red!important;
}
circle {
	fill: red!important;
}
</style>
<rect id="rect" fill="blue" style="opacity: .5!important"/>
```

After optimization will become:
```xml
<style>
rect {
	fill: red;
	stroke: red;
}
circle {
	fill: red;
}
</style>
<rect id="rect" fill="blue" style="opacity:.5"/>
```
