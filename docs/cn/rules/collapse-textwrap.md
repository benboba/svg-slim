# collapse-textwrap

* 默认配置：
```json
{
	"rules": {
		"collapse-textwrap": true
	}
}
```

* 说明：
	* 当 tspan 不包含任何有效属性时，将其替换为它的所有子节点
	* 当存在 tspan 嵌套，且父节点的子节点中只存在一个 tspan 时，将合并属性，并将父节点替换为所有子节点

例如：
```xml
<text fill="red"><tspan>123</tspan></text>
<text><tspan dx="10"><tspan dy="10">123</tspan></tspan></text>
```

优化后将变为：
```xml
<text fill="red">123</text>
<text><tspan dy="10" dx="10">123</tspan></text>
```
