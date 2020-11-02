# rm-attribute

* 默认配置：
```json
{
	"rules": {
		"rm-attribute": [true, {
			"keepAria": false,
			"keepEvent": false
		}]
	}
}
```

* 说明：
	* 移除非规范的属性（不在[SVG规范](https://www.w3.org/TR/SVG/attindex.html)中，且并非xmlns类的属性）
* 配置参数：
	* keepAria
		* 默认值：false
		* 保留所有的[aria](https://www.w3.org/TR/wai-aria-1.1/)属性，目前默认移除
	* keepEvent
		* 默认值：false
		* 保留所有的[事件监听](https://www.w3.org/TR/SVG/interact.html#TermEventAttribute)属性，目前默认移除

例如：
```xml
<g fill="red">
	<rect fill="black" width="100" height="100" aa="1" bb="2" cc="3" aria-autocomplete="both" onclick="console.log('a');"/>
</g>
```

优化后将变为：
```xml
<g fill="red">
	<rect fill="black" width="100" height="100"/>
</g>
```
