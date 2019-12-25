// 获取属性（根据 SVG 覆盖规则，css 优先）
export const getAttr = (node: ITagNode, key: string, defaultVal: string): string => {
	let val = defaultVal;
	const styles = node.styles as IStyleObj;
	if (styles.hasOwnProperty(key)) {
		val = styles[key].value;
	}
	return val;
};
