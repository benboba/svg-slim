# combine-transform

* 默认配置：
```json
{
	"rules": {
		"combine-transform": true
	}
}
```

* 说明：
	* 分析并合并 transform 属性

例如：
```xml
<rect fill="red" width="100" height="100" transform="translate(100,100)scale(2)rotate(180)"/>
```

优化后将变为：
```xml
<rect fill="red" width="100" height="100" transform="matrix(-2,0,0,-2,100,100)"/>
```
