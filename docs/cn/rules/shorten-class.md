# shorten-class

* 默认配置：
```json
{
	"rules": {
		"shorten-class": true
	}
}
```
* 说明：
	* 缩短 className
	* 移除不被引用的 className

例如：
```xml
<style>.red_rect {fill: red;}</style>
<rect class="red_rect blue_rect" width="100" height="100"/>
```

优化后将变为：（.red_rect 被缩短为 .a，.blue_rect 直接被移除）
```xml
<style>.a {fill: red;}</style>
<rect class="a" width="100" height="100"/>
```
