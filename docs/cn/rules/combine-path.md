# combine-path

* 默认配置：
```json
{
	"rules": {
		"combine-path": [true, {
			"disregardFill": false,
			"disregardOpacity": false
		}]
	}
}
```

* 说明：
	* 合并满足以下条件的路径节点：
		1. 所有属性和样式（包括继承样式）相同
		2. 相邻
		3. 没有 fill
		4. stroke 的透明度不小于 1
		5. 没有 marker-start、marker-mid、marker-end
* 配置参数：
	* disregardFill
		* 默认值：false
		* 是否允许合并满足以下条件的路径：
			1. stroke 为空
			2. fill-rull 不是 evenodd
			3. fill 的透明度不小于 1
	* disregardOpacity
		* 默认值：false
		* 是否允许合并透明度小于 1 的路径

例如：
```xml
<path d="M0,0L100,100" fill="none" stroke="red" stroke-width="2"/>
<path d="M0,50L100,150" fill="none" stroke="red" stroke-width="2"/>
```

优化后将变为
```xml
<path d="M0,0L100,100M0,50L100,150" fill="none" stroke="red" stroke-width="2"/>
```
