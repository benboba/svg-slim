# collapse-textwrap

* Default configuration:
```json
{
	"rules": {
		"collapse-textwrap": true
	}
}
```
* Explanation:
	* When tspan does not contain any valid attributes, replace it with all its child nodes
	* When there is tspan nesting and there is only one tspan among the child nodes of the parent node, the attributes will be merged and the parent node will be replaced with all child nodes

E.g:
```xml
<text fill="red"><tspan>123</tspan></text>
<text><tspan dx="10"><tspan dy="10">123</tspan></tspan></text>
```

After optimization will become:
```xml
<text fill="red">123</text>
<text><tspan dy="10" dx="10">123</tspan></text>
```
