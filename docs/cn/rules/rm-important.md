# rm-important

* 默认配置：
```json
{
	"rules": {
		"rm-important": true
	}
}
```

* 说明：
	* 移除样式表中不必要的 !important
	* 会保留以下情况的 !important
		* style 标签的样式覆盖内联样式
		* 低优先级选择器覆盖高优先级选择器
		* 覆盖了具有 !important 标记的样式

例如：
```xml
<style>
rect {
	fill: red!important;
	stroke: red!important;
}
circle {
	fill: red!important;
}
</style>
<rect id="rect" fill="blue" style="opacity: .5!important"/>
```

优化后将变为：
```xml
<style>
rect {
	fill: red;
	stroke: red;
}
circle {
	fill: red;
}
</style>
<rect id="rect" fill="blue" style="opacity:.5"/>
```
