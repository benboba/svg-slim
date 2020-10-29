# shorten-color

* 默认配置：
```json
{
	"rules": {
		"shorten-color": [true, {
			"rrggbbaa": false
		}]
	}
}
```
* 说明：
	* 尽可能地缩短颜色定义
* 配置参数
	* rrggbbaa
		* 默认值：false
		* 是否采用 8 位的 16 进制颜色（例如：rgba(255,0,0,0.5) => #ff000080）

例如：
```xml
<rect fill="#ff0000" stroke="rgb(255,255,255)" color="rgba(0,0,0,0)" width="100" height="100"/>
```

优化后将变为：
```xml
<rect fill="red" stroke="#fff" color="transparent" width="100" height="100"/>
```
