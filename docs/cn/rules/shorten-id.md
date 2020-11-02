# shorten-id

* 默认配置：
```json
{
	"rules": {
		"shorten-id": true
	}
}
```
* 说明：
	* 缩短 ID
	* 移除不被引用的 ID

例如：
```xml
<defs>
	<circle id="circle-1" fill="#000" cx="60" cy="60" r="60"></circle>
</defs>
<mask id="mask-2" fill="white">
	<use xlink:href="#circle-1" />
</mask>
<rect id="rect-3" fill="red" width="100" height="100" mask="url(#mask-2)"/>
```

优化后将变为：（#rect-3 被移除，另外 2 个 id 被缩短）
```xml
<defs>
	<circle id="a" fill="#000" cx="60" cy="60" r="60"></circle>
</defs>
<mask id="b" fill="white">
	<use xlink:href="#a" />
</mask>
<rect fill="red" width="100" height="100" mask="url(#b)"/>
```
