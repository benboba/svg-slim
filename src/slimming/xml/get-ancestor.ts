import { INode, ITagNode } from 'typings/node';

// 根据条件获取祖先元素
export const getAncestor = (tag: ITagNode, checkFn: (node: INode) => boolean) => {
	let _tag: INode = tag;
	if (checkFn(_tag)) {
		return _tag;
	}
	while (_tag.parentNode) {
		_tag = _tag.parentNode;
		if (checkFn(_tag)) {
			return _tag;
		}
	}
	return null;
};
