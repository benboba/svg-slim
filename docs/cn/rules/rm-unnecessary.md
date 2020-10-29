# rm-unnecessary

* 默认配置：
```json
{
	"rules": {
		"rm-unnecessary": [true, {
			"tags": ["desc", "discard", "foreignObject", "video", "audio", "iframe", "canvas", "metadata", "script", "title", "unknown", "image"]
		}]
	}
}
```
* 说明：
	* 移除不必要的标签
	* **虽然默认并不移除 style 标签，但部分规则（如 shape-to-path）可能会导致样式表中的选择器无法命中**
	* **由于并没有对 javascript 脚本进行分析处理，如果默认不移除 script 标签，不能保证优化后的代码仍然可以正确执行**
* 配置参数：
	* tags
		* 默认值：["desc", "discard", "foreignObject", "video", "audio", "iframe", "canvas", "metadata", "script", "title", "unknown", "image"]
		* 限制为字符串列表
		* 配置需要移除的标签名称，只能移除以下列表中的标签：["desc", "discard", "foreignObject", "video", "audio", "iframe", "canvas", "metadata", "script", "style", "title", "unknown", "image"]
