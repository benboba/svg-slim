import { INode } from '../../node/index';

export const rmNode = (node: INode): void => {
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
};
