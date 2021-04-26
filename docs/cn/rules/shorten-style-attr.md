# shorten-style-attr

* 默认配置：
```json
{
	"rules": {
		"shorten-style-attr": true
	}
}
```
* 说明：
	* 视情况进行 style 和属性的互转

第一种情况（属性转 style）：
```xml
<text font-family="Arial" font-size="13.31" font-stretch="Normal" font-weight="400!important" font-style="italic" fill="red">80</text>
```

优化结果为（注意 font-size 会被追加 px 单位）：
```xml
<text style="font-family:Arial;font-size:13.31px;font-stretch:Normal;font-weight:400!important;font-style:italic;fill:red">80</text>
```

第二种情况（style 转属性）：
```xml
<rect style="fill:blue;stroke:red"/>
```

优化结果为：
```xml
<rect fill="blue" stroke="red"/>
```

第三种情况（遇到无法转属性的 style，将反转规则为属性转 style）：
```xml
<rect fill="blue" stroke="red" style="box-sizing:border-box"/>
```

优化结果为：
```xml
<rect style="box-sizing:border-box;fill:blue;stroke:red"/>
```
