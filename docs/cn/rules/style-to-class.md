# style-to-class

* 默认配置：
```json
{
	"rules": {
		"style-to-class": [true]
	}
}
```
* 说明：
	* 如果多个标签具有完全相同的 style 属性，将移除这些属性，并在 \<style> 标签中创建一个 class
	* 如果 \<style> 标签不存在，将主动创建一个，并插入到 \<svg> 标签的最前面
	* 相同的 style 属性不能少于 3 个，且标签数量乘以 style 属性数量不能小于 10，例如：
    	* 不少于 4 个标签的 style 属性相同，且 style 属性数量不少于 3 个
    	* 不少于 3 个标签的 style 属性相同，且 style 属性数量不少于 4 个
    	* 不少于 2 个标签的 style 属性相同，且 style 属性数量不少于 5 个

例如：
```xml
<text style="fill:blue;font-size:12px;font-weight:400;">1</text>
<text style="fill:blue;font-size:12px;font-weight:400;">2</text>
<text style="fill:blue;font-size:12px;font-weight:400;">3</text>
<text style="fill:blue;font-size:12px;font-weight:400;">4</text>
```

优化后将变为：
```xml
<style>.newClassName{fill:blue;font-size:12px;font-weight:400}</style>
<text class="newClassName">1</text>
<text class="newClassName">2</text>
<text class="newClassName">3</text>
<text class="newClassName">4</text>
```
