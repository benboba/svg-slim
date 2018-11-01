import { INode } from '../../node/index';
import { IRegularAttr } from '../const/regular-attr';
import { traversalNode } from '../xml/traversal-node';
import { isTag } from '../xml/is-tag';

function getXlink(styleDefine: IRegularAttr, idStr: string, dom: INode, unique: INode[]) {
    // TODO：只有 xlink:href 吗？其它 IRI 或 funcIRI 属性是否也需要验证？
    // 遇到引用属性，还需要递归验证被引用对象是否可应用样式
    let result = false;
    traversalNode(n => idStr === `#${n.getAttribute('id')}`, n => {
        result = check(styleDefine, n, dom, unique) || result;
    }, dom);
    return result;
}

function check(styleDefine: IRegularAttr, node: INode, dom: INode, unique: INode[]): boolean {
    if (styleDefine.applyTo.indexOf(node.nodeName) !== -1) {
        return true;
    }

    // 因为递归可能存在循环引用，所以需要排重
    if (unique.indexOf(node) !== -1) {
        return;
    }
    unique.push(node);

    let result = false;

    if (node.hasAttribute('xlink:href')) {
        result = getXlink(styleDefine, node.getAttribute('xlink:href'), dom, unique);
    }

    traversalNode(isTag, (childNode: INode) => {
        // 因为递归可能存在循环引用，所以需要排重
        if (unique.indexOf(childNode) !== -1) {
            return;
        }
        unique.push(childNode);
        if (styleDefine.applyTo.indexOf(childNode.nodeName) !== -1) {
            result = true;
        } else if (childNode.hasAttribute('xlink:href')) {
            result = getXlink(styleDefine, childNode.getAttribute('xlink:href'), dom, unique) || result;
        }
    }, node);
    return result;
}

// 深度分析，判断样式继承链上是否存在可应用对象
export const checkApply = (styleDefine: IRegularAttr, node: INode, dom: INode): boolean => {
    return check(styleDefine, node, dom, []);
};