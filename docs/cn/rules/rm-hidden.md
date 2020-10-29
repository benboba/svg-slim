# rm-hidden

* 默认配置：
```json
{
	"rules": {
		"rm-hidden": true
	}
}
```
* 说明：
	* 移除 display 属性为 none 的元素
	* 移除 fill 和 stroke 属性均为 none 的图形类元素
	* 移除没有子节点的文本容器
	* 移除既没有 path 属性，也没有 href 和 xlink:href 属性的 textPath 元素
	* 移除其它因某些原因不渲染的图形元素

以下内容将被移除：

display 为 none
```xml
<g style="display:none"></g>
```

stroke 和 fill 均为 none
```xml
<rect fill="none" stroke="none" width="100" height="100"/>
```

use 元素引用了不存在的 id
```xml
<use href="#undefined"/>
```

一些因尺寸属性为 0 导致不可见的元素，例如：
```xml
<pattern id="pattern-1" width="0" height="0" />
```
