// 移除其它类型的 xml 定义节点和 xml 片段节点
import { anyPass, propEq } from 'ramda';
import { NodeType } from '../../node/index';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

export const rmUseless = dom => new Promise((resolve, reject) => {
    traversalNode(anyPass([propEq('nodeType', NodeType.OtherSect), propEq('nodeType', NodeType.OtherDecl)]), rmNode, dom);
    resolve();
});