import { INode } from '../../node/index';
import { IRegularAttr, regularAttr } from '../const/regular-attr';
import { getById } from '../xml/get-by-id';
import { isTag } from '../xml/is-tag';
import { traversalNode } from '../xml/traversal-node';
import { execStyle } from './exec';

function getXlink(styleDefine: IRegularAttr, idStr: string, dom: INode, unique: INode[], fromStyleTag = false) {
    // TODO：只有 xlink:href 吗？其它 IRI 或 funcIRI 属性是否也需要验证？
    // 遇到引用属性，还需要递归验证被引用对象是否可应用样式
    return check(styleDefine, getById(idStr, dom), dom, unique, fromStyleTag);
}

function check(styleDefine: IRegularAttr, node: INode | undefined, dom: INode, unique: INode[], fromStyleTag = false): boolean {
    if (!node) return false;

    // 如果是检测 style 标签的样式，则只要遇到同名的 style 属性就返回 false
    if (fromStyleTag) {
        if (node.attributes) {
            for (let i = node.attributes.length; i--; ) {
                const attr = node.attributes[i];
                if (attr.fullname === 'style') {
                    const childStyle = execStyle(attr.value);
                    if (childStyle.some(style => style.fullname === styleDefine.name)) {
                        return false;
                    }
                }
            }
        }
    }

    if (styleDefine.applyTo.indexOf(node.nodeName) !== -1) {
        return true;
    }

    // 因为递归可能存在循环引用，所以需要排重
    if (unique.indexOf(node) !== -1) {
        return false;
    }

    unique.push(node);

    let result = false;

    if (node.hasAttribute('xlink:href')) {
        result = getXlink(styleDefine, node.getAttribute('xlink:href') as string, dom, unique);
    }

    traversalNode(isTag, (childNode: INode) => {
        // 因为递归可能存在循环引用，所以需要排重
        if (unique.indexOf(childNode) !== -1) {
            return;
        }
        unique.push(childNode);
        if (styleDefine.applyTo.indexOf(childNode.nodeName) !== -1) {
            result = true;
            if (childNode.attributes) {
                for (let i = childNode.attributes.length; i--; ) {
                    const attr = childNode.attributes[i];
                    if (attr.fullname === 'style') {
                        const childStyle = execStyle(attr.value);
                        result = !childStyle.some(style => style.fullname === styleDefine.name);
                    } else if (attr.fullname === styleDefine.name) {
                        result = false;
                    }
                }
            }
        } else if (childNode.hasAttribute('xlink:href')) {
            result = getXlink(styleDefine, childNode.getAttribute('xlink:href') as string, dom, unique, fromStyleTag) || result;
        }
    }, node);
    return result;
}

// 深度分析，判断样式继承链上是否存在可应用对象
export const checkApply = (
    styleDefine: IRegularAttr,
    node: INode,
    dom: INode,
    fromStyleTag = false // 标记是否为检测 style 标签的样式
): boolean => {
    return check(styleDefine, node, dom, [], fromStyleTag);
};
