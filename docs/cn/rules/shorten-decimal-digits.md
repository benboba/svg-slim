# shorten-decimal-digits

* 默认配置：
```json
{
	"rules": {
		"shorten-decimal-digits": true
	}
}
```
* 说明：
	* 缩小不同类型的数值精度

例如：
```xml
<rect fill="red" width="100.00001" height="100.00001" fill-opacity="0.05999"/>
```

优化后将变为：
```xml
<rect fill="red" width="100" height="100" fill-opacity="6%"/>
```
