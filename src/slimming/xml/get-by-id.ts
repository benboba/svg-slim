import { INode } from 'src/node';
import { traversalNode } from './traversal-node';

export function getById(idStr: string, dom: INode): INode {
    let result: INode = null;
    traversalNode(n => idStr === `#${n.getAttribute('id')}`, n => {
        if (!result) {
            result = n;
        }
    }, dom);
    return result;
}