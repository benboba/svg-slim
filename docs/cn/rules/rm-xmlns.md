# rm-xmlns

* 默认配置：
```json
{
	"rules": {
		"rm-xmlns": true
	}
}
```
* 说明：
	* 移除未被引用的 xmlns 定义，移除包含未定义命名空间的属性

例如：
```xml
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	<rect fill="red" width="100" height="100"/>
</svg>
```

优化后将变为（由于 xlink 这个 namespace 并没有被引用，所以被移除了）：
```xml
<svg xmlns="http://www.w3.org/2000/svg">
	<rect fill="red" width="100" height="100"/>
</svg>
```
