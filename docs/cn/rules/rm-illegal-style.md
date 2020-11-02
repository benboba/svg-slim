# rm-illegal-style

* 默认配置：
```json
{
	"rules": {
		"rm-illegal-style": true
	}
}
```
* 说明：
	* 移除既不是[标准属性](https://www.w3.org/TR/SVG/propidx.html)，也不在 [known-css-properties](https://github.com/known-css/known-css-properties#readme) 列表中的样式
	* 如果是[标准属性](https://www.w3.org/TR/SVG/propidx.html)，会验证值的合法性，不合法的值将被移除
	* 移除重复的 style 属性
	* 移除被 style 覆盖掉的普通属性
	* 如果 [params](../config.md#params) 开启了 rmAttrEqDefault，将移除和默认值等价（例如 black、#000、rgb(0,0,0) 都是等价的）的属性
	* 移除继承链上没有可应用对象的样式（例如 font-size、font-weight 等样式，只能应用于文本类节点）

例如：
```xml
<rect fill="red" style="fill:blue;background:red;unknown:unknown;stroke:none"/>
```

优化后将变为：
```xml
<rect style="fill:blue;background:red;"/>
```
- fill 属性被 style 中的同名定义覆盖，被移除
- background 存在于 known-css-properties 中，得到了保留
- unknown 不是合法的 css 样式，被移除
- stroke 的值 none 与默认值相同，被移除
