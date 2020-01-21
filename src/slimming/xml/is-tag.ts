import { propEq } from 'ramda';
import { NodeType } from '../../node/index';

export const isTag = propEq('nodeType', NodeType.Tag) as (node: INode) => node is ITagNode;
