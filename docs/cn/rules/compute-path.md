# compute-path

* 默认配置：
```json
{
	"rules": {
		"compute-path": true
	}
}
```

* 说明：
	* 计算 path 的 d 属性，使之变得更短

例如：
```xml
<path fill="red" d="M0,0L100,0,100,100,0,100z"/>
```

优化后将变为：
```xml
<path fill="red" d="m0,0h100v100H0z"/>
```
