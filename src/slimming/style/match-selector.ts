import { INode } from '../../node';
import { ISelector, attrModifier } from './define';

// 验证 selector 和 node 是否匹配
export const matchSelector = (node: INode, selector: ISelector): boolean => {
    if (!selector) {
        return false;
    }

    // 如果存在标签，则标签必须符合
    if (selector.type && selector.type !== node.nodeName) {
        return false;
    }

    // 如果存在 class 选择器，则每个 class 都要匹配
    if (selector.class) {
        let className = node.getAttribute('class');
        let classNames: string[] = [];
        if (className) {
            classNames = className.trim().split(/\s+/);
        }
        for (let ci = selector.class.length; ci--; ) {
            if (classNames.indexOf(selector.class[ci]) === -1) {
                return false;
            }
        }
    }

    // 如果存在 id 选择器，则每个 id 都要匹配
    if (selector.id) {
        let id = node.getAttribute('id');
        if (id) {
            id = id.trim();
        }
        for (let i = selector.id.length; i--; ) {
            if (id !== selector.id[i]) {
                return false;
            }
        }
    }

    if (selector.attr) {
        for (let ai = selector.attr.length; ai--; ) {
            const attrSelector = selector.attr[ai];
            let attr = node.getAttribute(attrSelector.key);
            if (attr === null) {
                return false;
            } else if (attrSelector.value) {
                // 属性值大小写不敏感
                attr = attr.trim().toLowerCase();
                switch (attrSelector.modifier) {
                    // 开始字符匹配
                    case attrModifier['^']:
                        if (attr.indexOf(attrSelector.value) !== 0) {
                            return false;
                        }
                        break;
                    // 结尾字符匹配
                    // tslint:disable-next-line:no-string-literal
                    case attrModifier['$']:
                        if (attr.lastIndexOf(attrSelector.value) !== attr.length - attrSelector.value.length) {
                            return false;
                        }
                        break;
                    // 空格分组字符匹配
                    case attrModifier['~']:
                        if (attr.split(/\s+/).indexOf(attrSelector.value) === -1) {
                            return false;
                        }
                        break;
                    // 前缀字符匹配
                    case attrModifier['|']:
                        if (attr !== attrSelector.value && attr.indexOf(`${attrSelector.value}-`) !== 0) {
                            return false;
                        }
                        break;
                    // 模糊匹配
                    case attrModifier['*']:
                        if (attr.indexOf(attrSelector.value) === -1) {
                            return false;
                        }
                        break;
                    // 默认全字匹配
                    default:
                        if (attr !== attrSelector.value) {
                            return false;
                        }
                        break;
                }
            }
        }
    }

    // TODO：未验证伪类和伪元素
    // if (selector.pseudo) {
    //     return true;
    // }

    return true;
};