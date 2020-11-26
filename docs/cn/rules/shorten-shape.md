# shorten-shape

* 默认配置：
```json
{
	"rules": {
		"shorten-shape": true
	}
}
```
* 说明：
	* 如果形状映射到 path 的结果更短，则使用 path
	* 如果 ellipse 形状的 rx 和 ry 相同，则转换为 circle

例如：
```xml
<rect fill="red" width="100" height="100"/>
```

优化后将变为：
```xml
<path fill="red" d="M0,0H100V100H0z"/>
```
