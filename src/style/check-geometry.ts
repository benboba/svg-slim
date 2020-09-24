import { geometryElements, geometryProperties } from '../const/definitions';

// 验证 geometry 属性在当前环境是否支持放置在 CSS 中
export const checkGeometry = (nodeName: string, attrName: string, browsers: Record<string, number>) => {
	if (geometryElements.includes(nodeName) && geometryProperties.includes(attrName)) {
		if (
			browsers.ie // ie 不支持
			||
			browsers.firefox // 火狐不支持
			||
			browsers.and_ff // 火狐不支持
			|| 
			(browsers.chrome && browsers.chrome < 81) // 推测 chrome 从 81 开始支持，未验证
			||
			(browsers.and_chr && browsers.and_chr < 81) // 推测 chrome android 从 81 开始支持，未验证
			||
			(browsers.edge && browsers.edge < 81) // 推测 edge 从 81 开始支持，未验证
			||
			(browsers.android && browsers.android < 81) // 推测 android 从 81 开始支持，未验证
		) {
			return false;
		}
		return true;
	}
	return false;
};
