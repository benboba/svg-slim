# rm-px

* 默认配置：
```json
{
	"rules": {
		"rm-px": true
	}
}
```
* 说明：
	* 移除 px 单位及 0 值的单位
	* 特殊情况：当 font-size、letter-spacing、word-spacing 位于 style 属性或 style 标签内，不会移除其 px 单位

例如：
```xml
<rect fill="red" width="100px" height="100px" rx="0pt"/>
```

优化后将变为：
```xml
<rect fill="red" width="100" height="100" rx="0"/>
```
