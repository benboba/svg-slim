import { INode } from '../../node/index';
import { matchSelector } from '../style/match-selector';
import { isTag } from './is-tag';
import { traversalNode } from './traversal-node';
import { idChar, classChar, attrChar, pseudoChar } from '../const/regs';
import { ISelector, selectorUnitCombinator, attrModifier } from '../style/define';

// 类似 querySelectorAll 的规则，找到所有符合条件的元素
export const getBySelector = (dom: INode, selector: string): INode[] => {
    const selectors: ISelector[] = [];
    const selectorUnitReg = new RegExp(`^([^\\s>+~#\\.\\[:]+|\\*)?(${idChar}|${classChar}|${attrChar}|${pseudoChar})*([\\s>+~]+|$)`);
    let selectorStr = selector;
    let selectorExec = selectorUnitReg.exec(selectorStr);
    while (selectorExec && selectorExec[0].length) {
        const selectorUnit: ISelector = { id: [], class: [], attr: [], pseudo: [] };
        if (selectorExec[1]) {
            if (selectorExec[1] === '*') {
                selectorUnit.universal = true;
            } else {
                selectorUnit.type = selectorExec[1];
            }
        }
        if (selectorExec[2]) {
            let specialStr = selectorExec[2];
            const specialReg = new RegExp(`^(?:${idChar}|${classChar}|${attrChar}|${pseudoChar}?:)`);
            let specialExec = specialReg.exec(specialStr);
            while (specialExec) {
                switch (specialExec[0][0]) {
                    case '#': // id 选择器
                        selectorUnit.id.push(specialExec[0].slice(1));
                        break;
                    case '.': // class 选择器
                        selectorUnit.class.push(specialExec[0].slice(1));
                        break;
                    case '[': // 属性选择器
                        const attrStr = specialExec[0].slice(1, -1);
                        const eqIndex: number = attrStr.indexOf['='];
                        if (eqIndex === -1) {
                            // 没有等号的情况
                            selectorUnit.attr.push({
                                key: attrStr
                            });
                        } else {
                            // 取出等号修饰符
                            if (attrModifier[attrStr[eqIndex - 1]]) {
                                selectorUnit.attr.push({
                                    key: attrStr.slice(0, eqIndex - 1),
                                    modifier: attrModifier[attrStr[eqIndex - 1]],
                                    value: attrStr.slice(eqIndex + 1)
                                });
                            } else {
                                selectorUnit.attr.push({
                                    key: attrStr.slice(0, eqIndex),
                                    value: attrStr.slice(eqIndex + 1)
                                });
                            }
                        }
                        break;
                    case ':': // 伪类，伪元素
                        const pseudoStr = specialExec[0].replace(/^:+/, '');
                        const parenIndex: number = pseudoStr.indexOf('(');
                        if (parenIndex === -1) {
                            // 不是函数型伪类
                            selectorUnit.pseudo.push({
                                func: pseudoStr
                            });
                        } else {
                            selectorUnit.pseudo.push({
                                func: pseudoStr.slice(0, parenIndex),
                                value: pseudoStr.slice(parenIndex + 1, -1)
                            });
                        }
                        break;
                    default:
                        break;
                }
                specialStr = specialStr.slice(specialExec[0].length);
                specialExec = specialReg.exec(specialStr);
            }
        }
        if (selectorExec[3]) {
            const combinator = selectorExec[3].trim();
            if (selectorUnitCombinator[combinator]) {
                selectorUnit.combinator = selectorUnitCombinator[combinator];
            }
        }
        selectors.push(selectorUnit);
        selectorStr = selectorStr.slice(selectorExec[0].length);
        selectorExec = selectorUnitReg.exec(selectorStr);
    }

    const len = selectors.length;
    const result: INode[] = [];
    traversalNode((node: INode) => isTag(node) && matchSelector(node, selectors[len - 1]), (node: INode) => {
        let i = len - 2;
        let currentNode = node;
        while (i >= 0) {
            switch (selectors[i].combinator) {
                // 子选择器
                case selectorUnitCombinator['>']:
                    if (!matchSelector(currentNode.parentNode, selectors[i])) {
                        return;
                    }
                    currentNode = node.parentNode;
                    break;
                // 相邻兄弟选择器
                case selectorUnitCombinator['+']:
                    const brothers = currentNode.parentNode.childNodes;
                    const index = brothers.indexOf(currentNode);
                    if (index <= 0 || !matchSelector(brothers[index - 1], selectors[i])) {
                        return;
                    }
                    currentNode = brothers[index - 1];
                    break;
                // 兄弟选择器
                case selectorUnitCombinator['~']:
                    const _brothers = currentNode.parentNode.childNodes;
                    const _index = _brothers.indexOf(currentNode);
                    if (_index <= 0) {
                        return;
                    }
                    let _brother: INode;
                    for (let bi = _index - 1; bi--; ) {
                        _brother = _brothers[bi];
                        if (matchSelector(_brother, selectors[i])) {
                            currentNode = _brother;
                            break;
                        }
                    }
                    if (currentNode !== _brother) {
                        return;
                    }
                    break;
                // 后代选择器
                default:
                    let parent = currentNode.parentNode;
                    while (parent.nodeName !== '#document') {
                        if (matchSelector(parent, selectors[i])) {
                            currentNode = parent;
                            break;
                        }
                        parent = parent.parentNode;
                    }
                    if (currentNode !== parent) {
                        return;
                    }
                    break;
            }
            i--;
        }

        result.push(node);
    }, dom);
    return result;
};