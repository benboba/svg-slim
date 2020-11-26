# rm-irregular-tag

* 默认配置：
```json
{
	"rules": {
		"rm-irregular-tag": [true, {
			"ignore": []
		}]
	}
}
```
* 说明：
	* 移除不在[SVG规范](https://www.w3.org/TR/SVG/eltindex.html)内的标签
* 配置参数：
	* ignore
		* 默认值：\[]
		* 限制为字符串列表，如果元素的标签名在列表中，则该元素虽然不是规范的 SVG 标签，也不会被移除
