# shorten-animate

* 默认配置：
```json
{
	"rules": {
		"shorten-animate": [true, {
			"remove": false
		}]
	}
}
```
* 说明：
	* 优化动画元素，同时移除不合法的动画元素
* 配置参数
	* remove
		* 默认值：false
		* 不做任何验证，直接移除所有的动画元素

例如：
```xml
<animate/><!-- 没有 attributeName -->
<animate attributeName="title" to="test"/><!-- title 不是 animatable 的属性 -->
<animate attributeName="x"/><!-- 没有 from/to/by/values -->
<animate attributeName="x" to="abc"/><!-- to 的值与 x 不匹配 -->
```

经过优化以上元素都会被移除
