# shorten-defs

* 默认配置：
```json
{
	"rules": {
		"shorten-defs": true
	}
}
```
* 说明：
	* 合并所有的 defs 标签
	* 移除无效的 defs 定义
	* 移除空的 defs 标签

例如：
```xml
<defs>
	<circle id="circle-1" fill="#000" cx="60" cy="60" r="60"></circle>
</defs>
<defs>
	<circle fill-opacity="0.599999964" fill="#000000" cx="60" cy="60" r="60"></circle>
</defs>
<mask id="mask-2" fill="white">
	<use xlink:href="#circle-1" />
</mask>
```

优化后将变为：
```xml
<defs>
	<circle id="path-1" fill="#000" cx="60" cy="60" r="60"></circle>
</defs>
<mask id="mask-2" fill="white">
	<use xlink:href="#path-1" />
</mask>
```
