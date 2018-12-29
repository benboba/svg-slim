import { Declaration, parse as cssParse, Rule, Stylesheet } from 'css';
import { propEq } from 'ramda';
import { IAttr } from 'src/node';
import { regularAttr } from '../const/regular-attr';
import { IStyleNode } from '../interface/node';
import { ISeletorPriority } from '../style/define';
import { execStyle } from '../style/exec';
import { execSelector } from '../style/exec-selector';
import { getSelectorPriority, overrideAble } from '../style/seletor-priority';
import { getById } from './get-by-id';
import { getBySelector } from './get-by-selector';
import { isTag } from './is-tag';
import { traversalNode } from './traversal-node';

interface IStyleItem {
    styles: IAttr[];
    selectorPriority: ISeletorPriority;
    nodes: IStyleNode[];
}

function check(dom: IStyleNode, styleItems: IStyleItem[]) {
    traversalNode<IStyleNode>(isTag, node => {
        if (!node.styles) {
            node.styles = {};
        }

        // 可能有 xlink 引用，css 样式会影响到 xlink 引用的节点
        let xlinkObj: IStyleNode;

        node.attributes.forEach(attr => {
            if (attr.fullname === 'style') {
                // 行内样式优先级最高
                const styles = execStyle(attr.value);
                styles.forEach(style => {
                    node.styles[style.name] = {
                        value: style.value,
                        from: 'inline'
                    };
                });
            } else if (attr.fullname === 'xlink:href') {
                // 获取 xlink 引用
                xlinkObj = getById(node.getAttribute('xlink:href'), dom);
            } else if (regularAttr[attr.fullname].couldBeStyle) {
                // 属性优先级最低，但可以覆盖继承
                const styleDefine = node.styles[attr.fullname];
                if (!styleDefine || styleDefine.from === 'inherit') {
                    node.styles[attr.fullname] = {
                        value: attr.value,
                        from: 'attr'
                    };
                }
            }
        });

        // 判断 style 标签内的样式，优先级高于 attr 和 inehrit
        styleItems.forEach(styleItem => {
            if (styleItem.nodes.indexOf(node) !== -1) {
                styleItem.styles.forEach(style => {
                    const styleDefine = node.styles[style.name];
                    if (!styleDefine || styleDefine.from === 'attr' || styleDefine.from === 'inherit' || (styleDefine.from === 'styletag' && overrideAble(styleItem.selectorPriority, styleDefine.selectorPriority))) {
                        node.styles[style.name] = {
                            value: style.value,
                            from: 'styletag',
                            selectorPriority: styleItem.selectorPriority
                        };
                    }
                });
            }
        });

        if (node.parentNode && node.parentNode.styles) {
            // 可能从父元素继承的样式
            Object.keys(node.parentNode.styles).forEach(key => {
                if (!node.styles[key]) {
                    const parentDefine = node.parentNode.styles[key];
                    node.styles[key] = {
                        value: parentDefine.value,
                        from: 'inherit'
                    };
                }
            });
        }

        if (xlinkObj) {
            if (!xlinkObj.styles) {
                xlinkObj.styles = {};
            }
            Object.keys(node.styles).forEach(key => {
                if (!xlinkObj.styles[key]) {
                    xlinkObj.styles[key] = {
                        value: node.styles[key].value,
                        from: 'inherit'
                    };
                }
            });
        }

    }, dom);
}

// 解析样式树，为每个节点增加 styles 属性，标记当前节点生效的样式信息
export function execStyleTree(dom: IStyleNode) {
    // 首先清理掉曾经被解析过的样式树
    traversalNode<IStyleNode>(isTag, node => {
        if (node.styles) {
            delete node.styles;
        }
    }, dom);

    let parsedCss: Stylesheet;
    const styleItems: IStyleItem[] = [];

    // 首先对 style 标签做处理，解析出所有起作用的 css 定义，并记录它们的选择器权重和影响到的节点
    traversalNode<IStyleNode>(propEq('nodeName', 'style'), node => {
        const cssContent = node.childNodes[0];
        parsedCss = cssParse(cssContent.textContent);

        parsedCss.stylesheet.rules.forEach((styleRule: Rule) => {
            // 只针对规则类
            if (styleRule.type === 'rule') {
                const styles: IAttr[] = [];
                styleRule.declarations.forEach((ruleItem: Declaration) => {
                    styles.push({
                        name: ruleItem.property,
                        fullname: ruleItem.property,
                        value: ruleItem.value
                    });
                });

                for (let si = styleRule.selectors.length; si--; ) {
                    const selector = execSelector(styleRule.selectors[si]);
                    const selectorPriority = getSelectorPriority(selector);
                    const nodes = getBySelector(dom, selector);
                    if (nodes.length) {
                        styleItems.push({
                            styles,
                            selectorPriority,
                            nodes
                        });
                    }
                }
            }
        });
    }, dom);

    check(dom, styleItems);
}
