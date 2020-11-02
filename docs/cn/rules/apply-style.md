# apply-style

* 默认配置：
```json
{
	"rules": {
		"apply-style": true
	}
}
```

* 说明：
	* 当 style 标签中某一条规则只命中了一个目标元素时，移除该规则，并将所有样式复制到目标元素的 style 属性中

例如：
```xml
<style>
rect {
    fill: red;
}
</style>
<rect width="100" height="100"/>
```

优化后将变为：
```xml
<rect width="100" height="100" style="fill:red"/>
```
