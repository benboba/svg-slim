# rm-viewbox

* 默认配置：
```json
{
	"rules": {
		"rm-viewbox": true
	}
}
```
* 说明：
	* 当 x、y、width、height 完全相同时，移除 viewBox 属性

例如：
```xml
<svg width="1000" height="600" viewBox="0 0 1000 600">
```

优化后将变为：
```xml
<svg width="1000" height="600">
```
