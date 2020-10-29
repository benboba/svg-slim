# shorten-shape

* Default configuration:
```json
{
	"rules": {
		"shorten-shape": true
	}
}
```
* Explanation:
	* If the result of the shape mapping to path is shorter, use path
	* If the rx and ry of the ellipse shape are the same, convert to circle
* Configuration parameters:
	* thinning
		* Default value: 0
		* Limited to 0 or positive integer
		* Thinning polygons and polylines for shorter results
		* 0 means do not perform thinning nodes, non-zero will be regarded as the threshold of thinning nodes

E.g:
```xml
<rect fill="red" width="100" height="100"/>
```

After optimization will become:
```xml
<path fill="red" d="M0,0H100V100H0z"/>
```
