# shorten-filter

* 默认配置：
```json
{
	"rules": {
		"shorten-filter": true
	}
}
```
* 说明：
	* 优化 [Filter Elements](https://drafts.fxtf.org/filter-effects/#FilterElement)
	* 移除空的 filter 元素
	* filter 元素的 width 和 height 不能是 0 或负数
	* feComponentTransfer 下不允许重复的 transferFunctionElement
	* transferFunctionElement 根据 type 只保留必要的属性

例如：
```xml
<filter></filter>
<filter>
	<feComponentTransfer>
		<feFuncR type="gamma" amplitude="1" exponent="1" offset="0"/>
		<feFuncR type="linear" amplitude="1" exponent="1" offset="0" slope="2"/>
	</feComponentTransfer>
</filter>
```

优化后将变为：
```xml
<filter>
	<feComponentTransfer>
		<feFuncR type="linear" slope="2"/>
	</feComponentTransfer>
</filter>
```
