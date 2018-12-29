import { INode } from '../../node/index';
import { matchSelector } from '../style/match-selector';
import { isTag } from './is-tag';
import { traversalNode } from './traversal-node';
import { ISelector, selectorUnitCombinator } from '../style/define';

// 类似 querySelectorAll 的规则，找到所有符合条件的元素
export const getBySelector = (dom: INode, selectors: ISelector[]): INode[] => {
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