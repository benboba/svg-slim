import { anyPass, propEq } from 'ramda';
import { INode } from '../../node/index';
import { douglasPeucker as DP } from '../algorithm/douglas-peucker';
import { traversalNode } from '../xml/traversal-node';

export const douglasPeucker = (rule, dom) => new Promise((resolve, reject) => {
	if (rule[0] && rule[1]) {
		traversalNode(anyPass([propEq('nodeName', 'polygon'), propEq('nodeName', 'polyline')]), (node: INode) => {
			const pointsVal = node.getAttribute('points');
			if (pointsVal) {
				const paths: number[] = pointsVal.trim().split(/[,\s]+/).map(s => parseFloat(s));
				node.setAttribute('points', DP(rule[1], paths).join(','));
			}
		}, dom);
	}
	resolve();
});