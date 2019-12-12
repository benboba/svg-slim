export const rmNode = (node: INode): void => {
	if (node.parentNode) {
		node.parentNode.removeChild(node);
	}
};
