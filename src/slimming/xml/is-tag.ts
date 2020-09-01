import { propEq } from 'ramda';
import { INode, ITagNode } from '../../../typings/node';
import { NodeType } from '../../node/index';

export const isTag = propEq('nodeType', NodeType.Tag) as (node: INode) => node is ITagNode;
