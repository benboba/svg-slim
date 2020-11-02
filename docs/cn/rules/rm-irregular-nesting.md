# rm-irregular-nesting

* 默认配置：
```json
{
	"rules": {
		"rm-irregular-nesting": [true, {
			"ignore": []
		}]
	}
}
```
* 说明：
	* 移除不规范嵌套的标签
* 配置参数：
	* ignore
		* 默认值：\[]
		* 限制为字符串列表，如果元素的标签名在列表中，则该元素及子元素均不会验证嵌套规则

例如：
```xml
<rect fill="red" width="100px" height="100px"><circle cx="100" cy="100" r="100"/></rect>
```

优化后将变为：
```xml
<rect fill="red" width="100" height="100"/>
```
