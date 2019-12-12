/*
 * 除了 EndTag ，其它值都来自标准：
 * https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
 */
export enum NodeType {
	EndTag = -1,
	Tag = 1,
	Text = 3,
	CDATA = 4,
	OtherSect = 5,
	OtherDecl = 6,
	XMLDecl = 7,
	Comments = 8,
	Document = 9,
	DocType = 10,
}
