import { propEq } from 'ramda';
import { INode, NodeType } from 'svg-vdom';
import { ITag } from '../../typings/node';

export const isTag = propEq('nodeType', NodeType.Tag) as (node: INode) => node is ITag;
