import { propEq } from 'ramda';
import { NodeType } from '../../node/index';

export const isTag: ((node: INode) => boolean) = propEq('nodeType', NodeType.Tag);
