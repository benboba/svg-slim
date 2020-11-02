# shorten-class

* Default configuration:
```json
{
	"rules": {
		"shorten-class": true
	}
}
```
* Explanation:
	* Shorten className
	* Remove unreferenced className

E.g:
```xml
<style>.red_rect {fill: red;}</style>
<rect class="red_rect blue_rect" width="100" height="100"/>
```

After optimization will become (.red_rect is shortened to .a, .blue_rect is removed directly):
```xml
<style>.a {fill: red;}</style>
<rect class="a" width="100" height="100"/>
```
