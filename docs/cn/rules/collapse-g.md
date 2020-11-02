# collapse-g

* 默认配置：
```json
{
	"rules": {
		"collapse-g": true
	}
}
```

* 说明：
	* 当 g 元素没有子元素时，移除该元素
	* 当 g 元素没有属性值时，用子元素替换该元素
	* 当 g 元素只有一个子元素，且自身没有 id、class、mask 属性时，将 g 元素的属性复制到子元素，并用子元素替换之

例如：
```xml
<g></g>
<g fill="red"><rect width="100" height="100"/></g>
```

优化后将变为：
```xml
<rect fill="red" width="100" height="100"/>
```
