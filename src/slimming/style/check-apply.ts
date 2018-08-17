import { INode } from '../../node/index';
import { IRegularAttr } from '../const/regular-attr';
import { traversalNode } from '../xml/traversal-node';
import { isTag } from '../xml/is-tag';

const check = (styleDefine: IRegularAttr, node: INode, dom: INode, unique: INode[]): boolean => {
    if (styleDefine.applyTo.indexOf(node.nodeName) !== -1) {
        return true;
    }

    // 因为递归可能存在循环引用，所以需要排重
    if (unique.indexOf(node) !== -1) {
        return;
    }
    unique.push(node);

    let result = false;
    traversalNode(isTag, (childNode: INode) => {
        // 因为递归可能存在循环引用，所以需要排重
        if (unique.indexOf(childNode) !== -1) {
            return;
        }
        unique.push(childNode);
        if (styleDefine.applyTo.indexOf(childNode.nodeName) !== -1) {
            result = true;
        } else if (childNode.hasAttribute('xlink:href')) {
            // 遇到引用属性，还需要递归验证被引用对象是否可应用样式
            traversalNode(n => childNode.getAttribute('xlink:href') === `#${n.getAttribute('id')}`, n => {
                if (check(styleDefine, n, dom, unique)) {
                    result = true;
                }
            }, dom);
        }
    }, node);
    return result;
};

// 深度分析，判断样式继承链上是否存在可应用对象
export const checkApply = (styleDefine: IRegularAttr, node: INode, dom: INode): boolean => {
    return check(styleDefine, node, dom, []);
};